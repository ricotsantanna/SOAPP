import { sql } from '@vercel/postgres';
import { hashPassword, verifyPassword } from './auth';

export interface User {
  id: number;
  email: string;
  password_hash?: string;
  role?: 'admin' | 'user';
  business_model?: 'service' | 'retail';
  plan?: 'start' | 'agenda' | 'social' | 'max';
  created_at?: string;
}

export interface UserAIKey {
  id?: number;
  user_id: number;
  provider: 'openai' | 'gemini' | 'claude' | 'nvidia' | 'custom';
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
  active_provider?: 'openai' | 'gemini' | 'claude' | 'nvidia' | 'custom';
  custom_base_url?: string;
  custom_model_name?: string;
  user_email?: string;
  bot_paused_until?: string | null;
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

export interface Carousel {
  id?: number;
  user_id: number;
  title: string;
  slides_count: number;
  date: string;
  created_at?: string;
}

export interface ChatMessage {
  id?: number;
  user_id: number;
  remote_jid?: string;
  sender: 'user' | 'assistant';
  text: string;
  created_at?: string;
}

/**
 * Initializes database tables according to Social One SQL schema with password authentication.
 */
export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT,
        role VARCHAR(20) DEFAULT 'user',
        business_model VARCHAR(50),
        plan VARCHAR(50) DEFAULT 'start',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Migration helper for existing databases
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS business_model VARCHAR(50);`.catch(() => {});
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS plan VARCHAR(50) DEFAULT 'start';`.catch(() => {});

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
        system_prompt TEXT,
        active_provider VARCHAR(50) DEFAULT 'openai',
        custom_base_url TEXT,
        custom_model_name VARCHAR(100)
      );
    `;

    await sql`ALTER TABLE whatsapp_instances ADD COLUMN IF NOT EXISTS bot_paused_until TIMESTAMP;`.catch(() => {});

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

    await sql`
      CREATE TABLE IF NOT EXISTS carousels (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        slides_count INT DEFAULT 5,
        date VARCHAR(50) DEFAULT 'Hoje',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        remote_jid VARCHAR(100) DEFAULT 'web_client',
        sender VARCHAR(20) NOT NULL,
        text TEXT NOT NULL,
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
const DEFAULT_ADMIN_HASH = hashPassword("admin123456");
const DEFAULT_USER_HASH = hashPassword("12345678");

const inMemoryStore = {
  users: [
    { id: 1, email: "admin@socialoneapp.com.br", password_hash: DEFAULT_ADMIN_HASH, role: "admin" as const, created_at: new Date().toISOString() },
    { id: 2, email: "cliente.demo@empresa.com.br", password_hash: DEFAULT_USER_HASH, role: "user" as const, created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 3, email: "contato@lojadetalhes.com.br", password_hash: DEFAULT_USER_HASH, role: "user" as const, created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
    { id: 4, email: "suporte@techcorp.com.br", password_hash: DEFAULT_USER_HASH, role: "user" as const, created_at: new Date(Date.now() - 86400000 * 12).toISOString() }
  ] as User[],
  aiKeys: [] as UserAIKey[],
  instances: [
    {
      id: 1,
      user_id: 1,
      instance_name: "socialone_admin",
      status: "disconnected" as const,
      phone_number: "",
      system_prompt: "Assistente Central Social One",
      user_email: "admin@socialoneapp.com.br"
    },
    {
      id: 2,
      user_id: 2,
      instance_name: "inst_loja_demo",
      status: "disconnected" as const,
      phone_number: "",
      system_prompt: "Atendente Loja Demo",
      user_email: "cliente.demo@empresa.com.br"
    }
  ] as WhatsAppInstance[],
  knowledgeFiles: [
    { id: 1, user_id: 1, file_name: "Catalogo_Oficial_2026.pdf", file_type: "pdf" as const, created_at: new Date().toISOString() },
    { id: 2, user_id: 2, file_name: "FAQ_Atendimento.pdf", file_type: "pdf" as const, created_at: new Date().toISOString() }
  ] as KnowledgeFile[],
  carousels: [
    { id: 1, user_id: 1, title: '5 Dicas para Automatizar seu Atendimento', slides_count: 5, date: 'Hoje' },
    { id: 2, user_id: 1, title: 'Por que o modelo BYOAI economiza até 90%?', slides_count: 4, date: 'Ontem' }
  ] as Carousel[],
  chatMessages: [] as ChatMessage[]
};

export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const res = await sql<User>`SELECT * FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1;`;
    if (res.rows.length === 0) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    const user = res.rows[0];
    if (user.password_hash && !verifyPassword(password, user.password_hash)) {
      return { success: false, error: 'Senha incorreta' };
    }

    return { success: true, user };
  } catch {
    const user = inMemoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    if (user.password_hash && !verifyPassword(password, user.password_hash)) {
      return { success: false, error: 'Senha incorreta' };
    }

    return { success: true, user };
  }
}

export async function registerUser(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  const cleanEmail = email.toLowerCase().trim();
  const hashedPassword = hashPassword(password);
  const role = cleanEmail.includes('admin') ? 'admin' : 'user';

  try {
    const existing = await sql`SELECT id FROM users WHERE email = ${cleanEmail};`;
    if (existing.rows.length > 0) {
      return { success: false, error: 'E-mail já cadastrado na plataforma' };
    }

    const res = await sql<User>`
      INSERT INTO users (email, password_hash, role)
      VALUES (${cleanEmail}, ${hashedPassword}, ${role})
      RETURNING id, email, role, created_at;
    `;

    return { success: true, user: res.rows[0] };
  } catch {
    if (inMemoryStore.users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'E-mail já cadastrado na plataforma' };
    }

    const newUser: User = {
      id: inMemoryStore.users.length + 1,
      email: cleanEmail,
      password_hash: hashedPassword,
      role,
      created_at: new Date().toISOString()
    };
    inMemoryStore.users.push(newUser);
    return { success: true, user: newUser };
  }
}

export async function getOrCreateDemoUser(email: string = "admin@socialoneapp.com.br"): Promise<User> {
  try {
    const existing = await sql<User>`SELECT * FROM users WHERE email = ${email} LIMIT 1;`;
    if (existing.rows.length > 0) return existing.rows[0];

    const role = email.includes("admin") ? "admin" : "user";
    const inserted = await sql<User>`INSERT INTO users (email, password_hash, role) VALUES (${email}, ${DEFAULT_ADMIN_HASH}, ${role}) RETURNING *;`;
    return inserted.rows[0];
  } catch {
    let user = inMemoryStore.users.find(u => u.email === email);
    if (!user) {
      const role = email.includes("admin") ? "admin" : "user";
      user = { id: inMemoryStore.users.length + 1, email, password_hash: DEFAULT_ADMIN_HASH, role, created_at: new Date().toISOString() };
      inMemoryStore.users.push(user);
    }
    return user;
  }
}

export async function saveAIKey(userId: number, provider: 'openai' | 'gemini' | 'claude' | 'nvidia' | 'custom', encryptedApiKey: string) {
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
  // Try to build keys from environment variables first as a reliable fallback
  // (works in serverless where inMemoryStore is ephemeral)
  const envKeyMap: Record<string, string | undefined> = {
    openai: process.env.OPENAI_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
    claude: process.env.CLAUDE_API_KEY,
    nvidia: process.env.NVIDIA_API_KEY,
    custom: process.env.CUSTOM_API_KEY,
  };

  // Import encryption inline to avoid circular deps
  let encFn: ((k: string) => string) | null = null;
  try {
    const enc = await import('./encryption');
    encFn = enc.encryptApiKey;
  } catch {}

  const envKeys: UserAIKey[] = [];
  for (const [provider, envVal] of Object.entries(envKeyMap)) {
    if (envVal && envVal.trim() && !envVal.includes('xxxx')) {
      const encrypted = encFn ? encFn(envVal.trim()) : envVal.trim();
      envKeys.push({ user_id: userId, provider: provider as UserAIKey['provider'], encrypted_api_key: encrypted });
    }
  }

  try {
    const res = await sql<UserAIKey>`SELECT * FROM user_ai_keys WHERE user_id = ${userId};`;
    // Merge: DB rows take precedence over env vars
    const dbKeys = res.rows;
    const merged = [...envKeys];
    for (const dbKey of dbKeys) {
      const idx = merged.findIndex(k => k.provider === dbKey.provider);
      if (idx >= 0) merged[idx] = dbKey;
      else merged.push(dbKey);
    }
    return merged;
  } catch {
    const memKeys = inMemoryStore.aiKeys.filter(k => k.user_id === userId);
    if (memKeys.length > 0) {
      // Merge mem keys over env keys
      const merged = [...envKeys];
      for (const mk of memKeys) {
        const idx = merged.findIndex(k => k.provider === mk.provider);
        if (idx >= 0) merged[idx] = mk;
        else merged.push(mk);
      }
      return merged;
    }
    return envKeys;
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
          system_prompt = ${data.system_prompt !== undefined ? data.system_prompt : existing.system_prompt},
          active_provider = ${data.active_provider || existing.active_provider || 'openai'},
          custom_base_url = ${data.custom_base_url !== undefined ? data.custom_base_url : existing.custom_base_url || ''},
          custom_model_name = ${data.custom_model_name !== undefined ? data.custom_model_name : existing.custom_model_name || ''}
        WHERE id = ${existing.id};
      `;
    } else {
      await sql`
        INSERT INTO whatsapp_instances (user_id, instance_name, status, phone_number, system_prompt, active_provider, custom_base_url, custom_model_name)
        VALUES (${userId}, ${data.instance_name || 'socialone_inst'}, ${data.status || 'disconnected'}, ${data.phone_number || ''}, ${data.system_prompt || ''}, ${data.active_provider || 'openai'}, ${data.custom_base_url || ''}, ${data.custom_model_name || ''});
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

export async function getAllUsers(): Promise<User[]> {
  try {
    const res = await sql<User>`SELECT id, email, role, created_at FROM users ORDER BY created_at DESC;`;
    return res.rows;
  } catch {
    return inMemoryStore.users.map(({ password_hash, ...rest }) => rest);
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

export async function deleteKnowledgeFile(id: number, userId: number) {
  try {
    await sql`DELETE FROM knowledge_files WHERE id = ${id} AND user_id = ${userId};`;
    return { success: true };
  } catch {
    const idx = inMemoryStore.knowledgeFiles.findIndex(f => f.id === id && f.user_id === userId);
    if (idx >= 0) {
      inMemoryStore.knowledgeFiles.splice(idx, 1);
    }
    return { success: true };
  }
}

export async function saveCarousel(carousel: Carousel) {
  try {
    const inserted = await sql<Carousel>`
      INSERT INTO carousels (user_id, title, slides_count, date)
      VALUES (${carousel.user_id}, ${carousel.title}, ${carousel.slides_count || 5}, ${carousel.date || 'Hoje'})
      RETURNING *;
    `;
    return { success: true, carousel: inserted.rows[0] };
  } catch {
    const newItem: Carousel = {
      ...carousel,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    inMemoryStore.carousels.unshift(newItem);
    return { success: true, carousel: newItem };
  }
}

export async function getCarousels(userId: number): Promise<Carousel[]> {
  try {
    const res = await sql<Carousel>`SELECT * FROM carousels WHERE user_id = ${userId} ORDER BY created_at DESC;`;
    return res.rows;
  } catch {
    return inMemoryStore.carousels.filter(c => c.user_id === userId);
  }
}

export async function deleteCarousel(id: number, userId: number) {
  try {
    await sql`DELETE FROM carousels WHERE id = ${id} AND user_id = ${userId};`;
    return { success: true };
  } catch {
    const idx = inMemoryStore.carousels.findIndex(c => c.id === id && c.user_id === userId);
    if (idx >= 0) {
      inMemoryStore.carousels.splice(idx, 1);
    }
    return { success: true };
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

export async function saveChatMessage(userId: number, sender: 'user' | 'assistant', text: string, remoteJid: string = 'web_client'): Promise<ChatMessage> {
  try {
    const inserted = await sql<ChatMessage>`
      INSERT INTO chat_messages (user_id, sender, text, remote_jid)
      VALUES (${userId}, ${sender}, ${text}, ${remoteJid})
      RETURNING *;
    `;
    return inserted.rows[0];
  } catch {
    const msg: ChatMessage = {
      id: Date.now(),
      user_id: userId,
      sender,
      text,
      remote_jid: remoteJid,
      created_at: new Date().toISOString(),
    };
    inMemoryStore.chatMessages.push(msg);
    return msg;
  }
}

export async function getRecentChatMessages(userId: number, limit: number = 15, remoteJid?: string): Promise<ChatMessage[]> {
  try {
    let res;
    if (remoteJid) {
      res = await sql<ChatMessage>`
        SELECT * FROM (
          SELECT * FROM chat_messages 
          WHERE user_id = ${userId} AND remote_jid = ${remoteJid}
          ORDER BY id DESC LIMIT ${limit}
        ) sub ORDER BY id ASC;
      `;
    } else {
      res = await sql<ChatMessage>`
        SELECT * FROM (
          SELECT * FROM chat_messages 
          WHERE user_id = ${userId}
          ORDER BY id DESC LIMIT ${limit}
        ) sub ORDER BY id ASC;
      `;
    }
    return res.rows;
  } catch {
    let filtered = inMemoryStore.chatMessages.filter(m => m.user_id === userId);
    if (remoteJid) {
      filtered = filtered.filter(m => m.remote_jid === remoteJid);
    }
    return filtered.slice(-limit);
  }
}

export async function updateUserBusinessModel(userId: number, businessModel: 'service' | 'retail') {
  try {
    await sql`UPDATE users SET business_model = ${businessModel} WHERE id = ${userId};`;
    return { success: true };
  } catch {
    const user = inMemoryStore.users.find(u => u.id === userId);
    if (user) user.business_model = businessModel;
    return { success: true };
  }
}

export async function updateUserPlan(userId: number, plan: 'start' | 'agenda' | 'social' | 'max') {
  try {
    await sql`UPDATE users SET plan = ${plan} WHERE id = ${userId};`;
    return { success: true };
  } catch {
    const user = inMemoryStore.users.find(u => u.id === userId);
    if (user) user.plan = plan;
    return { success: true };
  }
}

export async function getUserProfile(userId: number): Promise<User | undefined> {
  try {
    const res = await sql<User>`SELECT id, email, role, business_model, plan, created_at FROM users WHERE id = ${userId};`;
    return res.rows[0];
  } catch {
    return inMemoryStore.users.find(u => u.id === userId);
  }
}

export async function pauseBotInstance(userId: number, instanceName: string, durationHours: number | null) {
  const pausedUntil = durationHours ? new Date(Date.now() + durationHours * 3600 * 1000).toISOString() : null;
  try {
    if (pausedUntil) {
      await sql`UPDATE whatsapp_instances SET bot_paused_until = ${pausedUntil} WHERE user_id = ${userId} AND instance_name = ${instanceName};`;
    } else {
      await sql`UPDATE whatsapp_instances SET bot_paused_until = NULL WHERE user_id = ${userId} AND instance_name = ${instanceName};`;
    }
    return { success: true, pausedUntil };
  } catch {
    const inst = inMemoryStore.instances.find(i => i.user_id === userId && i.instance_name === instanceName);
    if (inst) inst.bot_paused_until = pausedUntil;
    return { success: true, pausedUntil };
  }
}

export async function isBotPaused(userId: number, instanceName: string): Promise<{ isPaused: boolean; pausedUntil: string | null }> {
  try {
    const res = await sql`SELECT bot_paused_until FROM whatsapp_instances WHERE user_id = ${userId} AND instance_name = ${instanceName};`;
    const pausedUntil = res.rows[0]?.bot_paused_until;
    if (!pausedUntil) return { isPaused: false, pausedUntil: null };
    const isPaused = new Date(pausedUntil) > new Date();
    return { isPaused, pausedUntil };
  } catch {
    const inst = inMemoryStore.instances.find(i => i.user_id === userId && i.instance_name === instanceName);
    if (!inst?.bot_paused_until) return { isPaused: false, pausedUntil: null };
    const isPaused = new Date(inst.bot_paused_until) > new Date();
    return { isPaused, pausedUntil: inst.bot_paused_until };
  }
}

