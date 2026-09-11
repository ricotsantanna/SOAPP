import { sql } from '@vercel/postgres';

export interface User {
  id: number;
  email: string;
  created_at?: string;
}

export interface UserAIKey {
  id?: number;
  user_id: number;
  provider: 'openai' | 'gemini';
  encrypted_api_key: string;
  updated_at?: string;
}

export interface WhatsAppInstance {
  id?: number;
  user_id: number;
  instance_name: string;
  status: 'connected' | 'disconnected' | 'connecting';
  phone_number?: string;
  system_prompt?: string;
}

export interface KnowledgeFile {
  id?: number;
  user_id: number;
  file_name: string;
  file_type: 'pdf' | 'gdrive';
  file_url?: string;
  extracted_text?: string;
  created_at?: string;
}

/**
 * Initializes database tables according to Social One SQL schema.
 */
export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_ai_keys (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        provider VARCHAR(50) NOT NULL,
        encrypted_api_key TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS whatsapp_instances (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        instance_name VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'disconnected',
        phone_number VARCHAR(50),
        system_prompt TEXT
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS knowledge_files (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_url TEXT,
        extracted_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return { success: true, message: "Database schema validated successfully." };
  } catch (error) {
    console.warn("DB Initialization note (Database environment variables may be missing during build/demo):", error);
    return { success: false, error };
  }
}

// In-memory mock store fallback for seamless UI development without database connection
const inMemoryStore = {
  users: [{ id: 1, email: "demo@socialoneapp.com.br", created_at: new Date().toISOString() }],
  aiKeys: [] as UserAIKey[],
  instances: [
    {
      id: 1,
      user_id: 1,
      instance_name: "socialone_default",
      status: "disconnected" as const,
      phone_number: "+55 11 99999-8888",
      system_prompt: "Você é o assistente virtual inteligente da Social One. Seu objetivo é atender os clientes com cordialidade e precisão."
    }
  ] as WhatsAppInstance[],
  knowledgeFiles: [] as KnowledgeFile[]
};

export async function getOrCreateDemoUser(email: string = "demo@socialoneapp.com.br"): Promise<User> {
  try {
    const existing = await sql<User>`SELECT * FROM users WHERE email = ${email} LIMIT 1;`;
    if (existing.rows.length > 0) return existing.rows[0];

    const inserted = await sql<User>`INSERT INTO users (email) VALUES (${email}) RETURNING *;`;
    return inserted.rows[0];
  } catch {
    let user = inMemoryStore.users.find(u => u.email === email);
    if (!user) {
      user = { id: inMemoryStore.users.length + 1, email, created_at: new Date().toISOString() };
      inMemoryStore.users.push(user);
    }
    return user;
  }
}

export async function saveAIKey(userId: number, provider: 'openai' | 'gemini', encryptedApiKey: string) {
  try {
    const existing = await sql`SELECT id FROM user_ai_keys WHERE user_id = ${userId} AND provider = ${provider};`;
    if (existing.rows.length > 0) {
      await sql`
        UPDATE user_ai_keys 
        SET encrypted_api_key = ${encryptedApiKey}, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ${userId} AND provider = ${provider};
      `;
    } else {
      await sql`
        INSERT INTO user_ai_keys (user_id, provider, encrypted_api_key) 
        VALUES (${userId}, ${provider}, ${encryptedApiKey});
      `;
    }
    return { success: true };
  } catch {
    const idx = inMemoryStore.aiKeys.findIndex(k => k.user_id === userId && k.provider === provider);
    if (idx >= 0) {
      inMemoryStore.aiKeys[idx].encrypted_api_key = encryptedApiKey;
    } else {
      inMemoryStore.aiKeys.push({ user_id: userId, provider, encrypted_api_key: encryptedApiKey });
    }
    return { success: true };
  }
}

export async function getAIKeys(userId: number): Promise<UserAIKey[]> {
  try {
    const res = await sql<UserAIKey>`SELECT * FROM user_ai_keys WHERE user_id = ${userId};`;
    return res.rows;
  } catch {
    return inMemoryStore.aiKeys.filter(k => k.user_id === userId);
  }
}

export async function getWhatsAppInstance(userId: number): Promise<WhatsAppInstance | null> {
  try {
    const res = await sql<WhatsAppInstance>`SELECT * FROM whatsapp_instances WHERE user_id = ${userId} LIMIT 1;`;
    return res.rows[0] || null;
  } catch {
    return inMemoryStore.instances.find(i => i.user_id === userId) || null;
  }
}

export async function saveWhatsAppInstance(userId: number, data: Partial<WhatsAppInstance>) {
  try {
    const existing = await getWhatsAppInstance(userId);
    if (existing && existing.id) {
      await sql`
        UPDATE whatsapp_instances
        SET 
          instance_name = ${data.instance_name || existing.instance_name},
          status = ${data.status || existing.status},
          phone_number = ${data.phone_number || existing.phone_number},
          system_prompt = ${data.system_prompt !== undefined ? data.system_prompt : existing.system_prompt}
        WHERE id = ${existing.id};
      `;
    } else {
      await sql`
        INSERT INTO whatsapp_instances (user_id, instance_name, status, phone_number, system_prompt)
        VALUES (${userId}, ${data.instance_name || 'socialone_inst'}, ${data.status || 'disconnected'}, ${data.phone_number || ''}, ${data.system_prompt || ''});
      `;
    }
    return { success: true };
  } catch {
    const inst = inMemoryStore.instances.find(i => i.user_id === userId);
    if (inst) {
      Object.assign(inst, data);
    } else {
      inMemoryStore.instances.push({
        id: 1,
        user_id: userId,
        instance_name: data.instance_name || 'socialone_inst',
        status: data.status || 'disconnected',
        phone_number: data.phone_number || '',
        system_prompt: data.system_prompt || ''
      });
    }
    return { success: true };
  }
}

export async function saveKnowledgeFile(file: KnowledgeFile) {
  try {
    await sql`
      INSERT INTO knowledge_files (user_id, file_name, file_type, file_url, extracted_text)
      VALUES (${file.user_id}, ${file.file_name}, ${file.file_type}, ${file.file_url || ''}, ${file.extracted_text || ''});
    `;
    return { success: true };
  } catch {
    inMemoryStore.knowledgeFiles.push({
      ...file,
      id: inMemoryStore.knowledgeFiles.length + 1,
      created_at: new Date().toISOString()
    });
    return { success: true };
  }
}

export async function getKnowledgeFiles(userId: number): Promise<KnowledgeFile[]> {
  try {
    const res = await sql<KnowledgeFile>`SELECT * FROM knowledge_files WHERE user_id = ${userId} ORDER BY created_at DESC;`;
    return res.rows;
  } catch {
    return inMemoryStore.knowledgeFiles.filter(f => f.user_id === userId);
  }
}
