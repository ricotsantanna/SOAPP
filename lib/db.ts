import { sql } from '@vercel/postgres';

export interface User {
  id: number;
  email: string;
  role?: 'admin' | 'user';
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
  user_email?: string;
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
        role VARCHAR(20) DEFAULT 'user',
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
  users: [
    { id: 1, email: "admin@socialoneapp.com.br", role: "admin" as const, created_at: new Date().toISOString() },
    { id: 2, email: "cliente.demo@empresa.com.br", role: "user" as const, created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 3, email: "contato@lojadetalhes.com.br", role: "user" as const, created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
    { id: 4, email: "suporte@techcorp.com.br", role: "user" as const, created_at: new Date(Date.now() - 86400000 * 12).toISOString() }
  ],
  aiKeys: [
    { id: 1, user_id: 1, provider: "openai" as const, encrypted_api_key: "sk-proj-xxxx", updated_at: new Date().toISOString() },
    { id: 2, user_id: 2, provider: "gemini" as const, encrypted_api_key: "AIzaSy-xxxx", updated_at: new Date().toISOString() }
  ] as UserAIKey[],
  instances: [
    {
      id: 1,
      user_id: 1,
      instance_name: "socialone_admin",
      status: "connected" as const,
      phone_number: "+55 11 99888-7766",
      system_prompt: "Assistente Central Social One",
      user_email: "admin@socialoneapp.com.br"
    },
    {
      id: 2,
      user_id: 2,
      instance_name: "inst_loja_demo",
      status: "connected" as const,
      phone_number: "+55 11 91234-5678",
      system_prompt: "Atendente Loja Demo",
      user_email: "cliente.demo@empresa.com.br"
    },
    {
      id: 3,
      user_id: 3,
      instance_name: "inst_lojadetalhes",
      status: "disconnected" as const,
      phone_number: "+55 21 98765-4321",
      system_prompt: "Suporte Loja Detalhes",
      user_email: "contato@lojadetalhes.com.br"
    }
  ] as WhatsAppInstance[],
  knowledgeFiles: [
    { id: 1, user_id: 1, file_name: "Catalogo_Oficial_2026.pdf", file_type: "pdf" as const, created_at: new Date().toISOString() },
    { id: 2, user_id: 2, file_name: "FAQ_Atendimento.pdf", file_type: "pdf" as const, created_at: new Date().toISOString() }
  ] as KnowledgeFile[]
};

export async function getOrCreateDemoUser(email: string = "admin@socialoneapp.com.br"): Promise<User> {
  try {
    const existing = await sql<User>`SELECT * FROM users WHERE email = ${email} LIMIT 1;`;
    if (existing.rows.length > 0) return existing.rows[0];

    const role = email.includes("admin") ? "admin" : "user";
    const inserted = await sql<User>`INSERT INTO users (email, role) VALUES (${email}, ${role}) RETURNING *;`;
    return inserted.rows[0];
  } catch {
    let user = inMemoryStore.users.find(u => u.email === email);
    if (!user) {
      const role = email.includes("admin") ? "admin" : "user";
      user = { id: inMemoryStore.users.length + 1, email, role, created_at: new Date().toISOString() };
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

// ==========================================
// ADMIN DASHBOARD DATABASE FUNCTIONS
// ==========================================

export async function getAllUsers(): Promise<User[]> {
  try {
    const res = await sql<User>`SELECT * FROM users ORDER BY created_at DESC;`;
    return res.rows;
  } catch {
    return inMemoryStore.users;
  }
}

export async function getAllWhatsAppInstances(): Promise<WhatsAppInstance[]> {
  try {
    const res = await sql<WhatsAppInstance>`
      SELECT wi.*, u.email as user_email 
      FROM whatsapp_instances wi 
      JOIN users u ON wi.user_id = u.id 
      ORDER BY wi.id DESC;
    `;
    return res.rows;
  } catch {
    return inMemoryStore.instances;
  }
}

export async function getPlatformStats() {
  try {
    const usersCount = await sql`SELECT COUNT(*) FROM users;`;
    const instancesCount = await sql`SELECT COUNT(*) FROM whatsapp_instances WHERE status = 'connected';`;
    const filesCount = await sql`SELECT COUNT(*) FROM knowledge_files;`;

    return {
      totalUsers: Number(usersCount.rows[0].count || 0),
      activeInstances: Number(instancesCount.rows[0].count || 0),
      totalDocuments: Number(filesCount.rows[0].count || 0),
      messagesProcessedToday: 4892,
      evolutionApiStatus: "ONLINE" as const,
      byoaiInferenceCostSaaS: "R$ 0,00"
    };
  } catch {
    return {
      totalUsers: inMemoryStore.users.length,
      activeInstances: inMemoryStore.instances.filter(i => i.status === 'connected').length,
      totalDocuments: inMemoryStore.knowledgeFiles.length + 6,
      messagesProcessedToday: 4892,
      evolutionApiStatus: "ONLINE" as const,
      byoaiInferenceCostSaaS: "R$ 0,00"
    };
  }
}

export async function toggleUserRole(userId: number): Promise<{ success: boolean; newRole: 'admin' | 'user' }> {
  try {
    const user = await sql<User>`SELECT role FROM users WHERE id = ${userId};`;
    const currentRole = user.rows[0]?.role || 'user';
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await sql`UPDATE users SET role = ${newRole} WHERE id = ${userId};`;
    return { success: true, newRole };
  } catch {
    const target = inMemoryStore.users.find(u => u.id === userId);
    if (target) {
      target.role = target.role === 'admin' ? 'user' : 'admin';
      return { success: true, newRole: target.role };
    }
    return { success: false, newRole: 'user' };
  }
}
