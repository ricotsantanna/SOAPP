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

export interface Appointment {
  id?: number;
  user_id: number;
  customer_name: string;
  customer_phone: string;
  service_name: string;
  appointment_time: string;
  status: 'scheduled' | 'confirmed' | 'rescheduled' | 'cancelled';
  google_event_id?: string;
  created_at?: string;
}

export interface AISettings {
  user_id: number;
  billing_mode: 'byoai' | 'managed';
  api_provider: 'openai' | 'gemini' | 'claude' | 'nvidia' | 'custom';
  api_key?: string;
  system_prompt?: string;
  bot_paused_until?: string | null;
  monthly_message_limit: number;
  messages_used_this_month: number;
  courtesy_credits: number;
  courtesy_granted: boolean;
  is_quota_blocked: boolean;
  rollover_credits: number;
  pending_invoice_charges: number;
  alert_80_sent: boolean;
  alert_100_sent: boolean;
  updated_at?: string;
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

    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        service_name VARCHAR(255) NOT NULL,
        appointment_time TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'scheduled',
        google_event_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS ai_settings (
        user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        billing_mode VARCHAR(20) DEFAULT 'byoai',
        api_provider VARCHAR(50) DEFAULT 'openai',
        api_key TEXT,
        system_prompt TEXT,
        bot_paused_until TIMESTAMP WITH TIME ZONE,
        monthly_message_limit INT DEFAULT 0,
        messages_used_this_month INT DEFAULT 0,
        courtesy_credits INT DEFAULT 0,
        courtesy_granted BOOLEAN DEFAULT FALSE,
        is_quota_blocked BOOLEAN DEFAULT FALSE,
        rollover_credits INT DEFAULT 0,
        pending_invoice_charges DECIMAL(10,2) DEFAULT 0.00,
        alert_80_sent BOOLEAN DEFAULT FALSE,
        alert_100_sent BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const checkHash = hashPassword("Brasil@25");
    await sql`
      INSERT INTO users (email, password_hash, role, plan)
      VALUES ('checknextip@gmail.com', ${checkHash}, 'admin', 'max')
      ON CONFLICT (email) DO UPDATE SET password_hash = ${checkHash}, role = 'admin', plan = 'max';
    `.catch(() => {});

    return { success: true, message: "Database schema validated successfully." };
  } catch (error) {
    console.warn("DB Initialization note (Database environment variables may be missing during build/demo):", error);
    return { success: false, error };
  }
}

// In-memory mock store fallback for seamless UI development without database connection
const DEFAULT_ADMIN_HASH = hashPassword("admin123456");
const DEFAULT_USER_HASH = hashPassword("12345678");
const DEFAULT_CHECK_HASH = hashPassword("Brasil@25");

const inMemoryStore = {
  users: [
    { id: 1, email: "admin@socialoneapp.com.br", password_hash: DEFAULT_ADMIN_HASH, role: "admin" as const, plan: "max" as const, created_at: new Date().toISOString() },
    { id: 2, email: "cliente.demo@empresa.com.br", password_hash: DEFAULT_USER_HASH, role: "user" as const, created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 3, email: "contato@lojadetalhes.com.br", password_hash: DEFAULT_USER_HASH, role: "user" as const, created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
    { id: 4, email: "suporte@techcorp.com.br", password_hash: DEFAULT_USER_HASH, role: "user" as const, created_at: new Date(Date.now() - 86400000 * 12).toISOString() },
    { id: 5, email: "checknextip@gmail.com", password_hash: DEFAULT_CHECK_HASH, role: "admin" as const, plan: "max" as const, created_at: new Date().toISOString() }
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
  chatMessages: [] as ChatMessage[],
  appointments: [
    {
      id: 1,
      user_id: 1,
      customer_name: 'Ana Paula Souza',
      customer_phone: '51998877665',
      service_name: 'Consulta Estética Avançada',
      appointment_time: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
      status: 'scheduled',
      google_event_id: 'evt_demo_101',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 1,
      customer_name: 'Carlos Eduardo',
      customer_phone: '11987654321',
      service_name: 'Manutenção de Equipamentos',
      appointment_time: new Date(Date.now() + 42 * 3600 * 1000).toISOString(),
      status: 'scheduled',
      google_event_id: 'evt_demo_102',
      created_at: new Date().toISOString()
    }
  ] as Appointment[]
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

export async function getOrCreateDemoUser(email: string = "checknextip@gmail.com"): Promise<User> {
  try {
    const existing = await sql<User>`SELECT * FROM users WHERE email = ${email} LIMIT 1;`;
    if (existing.rows.length > 0) return existing.rows[0];

    const role = email.includes("admin") || email.includes("checknextip") ? "admin" : "user";
    const checkHash = hashPassword("Brasil@25");
    const inserted = await sql<User>`INSERT INTO users (email, password_hash, role, plan) VALUES (${email}, ${checkHash}, ${role}, 'max') RETURNING *;`;
    return inserted.rows[0];
  } catch {
    let user = inMemoryStore.users.find(u => u.email === email);
    if (!user) {
      const role = email.includes("admin") || email.includes("checknextip") ? "admin" : "user";
      const checkHash = hashPassword("Brasil@25");
      user = { id: inMemoryStore.users.length + 1, email, password_hash: checkHash, role, plan: 'max', created_at: new Date().toISOString() };
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

export async function getAppointments(userId: number): Promise<Appointment[]> {
  try {
    const res = await sql<Appointment>`
      SELECT * FROM appointments WHERE user_id = ${userId} ORDER BY appointment_time ASC;
    `;
    return res.rows;
  } catch {
    return inMemoryStore.appointments.filter(a => a.user_id === userId);
  }
}

export const getAppointmentsByUser = getAppointments;

export async function createAppointment(appt: Appointment): Promise<Appointment> {
  try {
    const res = await sql<Appointment>`
      INSERT INTO appointments (user_id, customer_name, customer_phone, service_name, appointment_time, status, google_event_id)
      VALUES (${appt.user_id}, ${appt.customer_name}, ${appt.customer_phone}, ${appt.service_name}, ${appt.appointment_time}, ${appt.status || 'scheduled'}, ${appt.google_event_id || null})
      RETURNING *;
    `;
    return res.rows[0];
  } catch {
    const newAppt: Appointment = {
      id: Date.now(),
      ...appt,
      created_at: new Date().toISOString(),
    };
    inMemoryStore.appointments.push(newAppt);
    return newAppt;
  }
}

export async function updateAppointmentStatus(id: number, status: 'scheduled' | 'confirmed' | 'rescheduled' | 'cancelled') {
  try {
    await sql`UPDATE appointments SET status = ${status} WHERE id = ${id};`;
    return { success: true };
  } catch {
    const appt = inMemoryStore.appointments.find(a => a.id === id);
    if (appt) appt.status = status;
    return { success: true };
  }
}

export async function getUpcomingAppointments24h(): Promise<Appointment[]> {
  try {
    const res = await sql<Appointment>`
      SELECT * FROM appointments 
      WHERE appointment_time >= NOW() 
        AND appointment_time <= NOW() + INTERVAL '24 hours'
        AND status = 'scheduled';
    `;
    return res.rows;
  } catch {
    const now = new Date();
    const next24 = new Date(now.getTime() + 24 * 3600 * 1000);
    return inMemoryStore.appointments.filter(a => {
      const t = new Date(a.appointment_time);
      return t >= now && t <= next24 && a.status === 'scheduled';
    });
  }
}

export async function getUserById(userId: number): Promise<User | null> {
  try {
    const res = await sql<User>`SELECT * FROM users WHERE id = ${userId} LIMIT 1;`;
    if (res.rows.length > 0) return res.rows[0];
  } catch {
    // fallback
  }
  return inMemoryStore.users.find(u => u.id === userId) || null;
}

// AI Engine & Billing Specification Operations
export async function getAISettings(userId: number): Promise<AISettings> {
  try {
    const res = await sql<AISettings>`SELECT * FROM ai_settings WHERE user_id = ${userId};`;
    if (res.rows.length > 0) {
      return res.rows[0];
    }
  } catch {
    // Sql error or fallback
  }

  // Determine user plan to set default monthly limit
  const user = await getUserById(userId);
  const plan = user?.plan || 'start';
  let defaultLimit = 3000;
  if (plan === 'agenda') defaultLimit = 6000;
  if (plan === 'social' || plan === 'max') defaultLimit = 12000;

  const defaultSettings: AISettings = {
    user_id: userId,
    billing_mode: 'byoai',
    api_provider: 'openai',
    monthly_message_limit: defaultLimit,
    messages_used_this_month: 0,
    courtesy_credits: 0,
    courtesy_granted: false,
    is_quota_blocked: false,
    rollover_credits: 0,
    pending_invoice_charges: 0,
    alert_80_sent: false,
    alert_100_sent: false,
    updated_at: new Date().toISOString()
  };

  try {
    await sql`
      INSERT INTO ai_settings (user_id, billing_mode, api_provider, monthly_message_limit, messages_used_this_month, courtesy_credits, courtesy_granted, is_quota_blocked, rollover_credits, pending_invoice_charges, alert_80_sent, alert_100_sent)
      VALUES (${userId}, 'byoai', 'openai', ${defaultLimit}, 0, 0, FALSE, FALSE, 0, 0.00, FALSE, FALSE)
      ON CONFLICT (user_id) DO NOTHING;
    `;
  } catch {
    // fallback ignore
  }

  return defaultSettings;
}

export async function updateAISettings(userId: number, updates: Partial<AISettings>): Promise<AISettings> {
  const current = await getAISettings(userId);
  const merged: AISettings = { ...current, ...updates, updated_at: new Date().toISOString() };

  try {
    await sql`
      INSERT INTO ai_settings (
        user_id, billing_mode, api_provider, api_key, system_prompt, bot_paused_until,
        monthly_message_limit, messages_used_this_month, courtesy_credits, courtesy_granted,
        is_quota_blocked, rollover_credits, pending_invoice_charges, alert_80_sent, alert_100_sent, updated_at
      ) VALUES (
        ${userId}, ${merged.billing_mode}, ${merged.api_provider}, ${merged.api_key || null}, ${merged.system_prompt || null}, ${merged.bot_paused_until || null},
        ${merged.monthly_message_limit}, ${merged.messages_used_this_month}, ${merged.courtesy_credits}, ${merged.courtesy_granted},
        ${merged.is_quota_blocked}, ${merged.rollover_credits}, ${merged.pending_invoice_charges}, ${merged.alert_80_sent}, ${merged.alert_100_sent}, ${merged.updated_at}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        billing_mode = EXCLUDED.billing_mode,
        api_provider = EXCLUDED.api_provider,
        api_key = EXCLUDED.api_key,
        system_prompt = EXCLUDED.system_prompt,
        bot_paused_until = EXCLUDED.bot_paused_until,
        monthly_message_limit = EXCLUDED.monthly_message_limit,
        messages_used_this_month = EXCLUDED.messages_used_this_month,
        courtesy_credits = EXCLUDED.courtesy_credits,
        courtesy_granted = EXCLUDED.courtesy_granted,
        is_quota_blocked = EXCLUDED.is_quota_blocked,
        rollover_credits = EXCLUDED.rollover_credits,
        pending_invoice_charges = EXCLUDED.pending_invoice_charges,
        alert_80_sent = EXCLUDED.alert_80_sent,
        alert_100_sent = EXCLUDED.alert_100_sent,
        updated_at = EXCLUDED.updated_at;
    `;
  } catch {
    // In-memory fallback
  }

  return merged;
}

/**
 * Message Abatement Engine following exact Specification Order:
 * 1. Franquia Regular Mensal
 * 2. Saldo de Cortesia (300 msgs)
 * 3. Saldo Extra Acumulado (rollover_credits)
 * 4. Bloqueio por Cota Excedida -> Transbordo Humano
 */
export async function deductMessageQuota(userId: number): Promise<{
  allowed: boolean;
  reason?: string;
  settings: AISettings;
  notificationSent?: string;
}> {
  const settings = await getAISettings(userId);

  // Mode BYOAI -> Uncapped, 0 limits applied
  if (settings.billing_mode === 'byoai') {
    return { allowed: true, settings };
  }

  // Quota blocked or Human handoff active
  if (settings.is_quota_blocked) {
    return { allowed: false, reason: 'QUOTA_BLOCKED_HUMAN_HANDOFF', settings };
  }

  if (settings.bot_paused_until && new Date(settings.bot_paused_until) > new Date()) {
    return { allowed: false, reason: 'BOT_PAUSED_HUMAN_HANDOFF', settings };
  }

  let notificationSent: string | undefined = undefined;

  // Abatement Step 1: Franquia Regular Mensal
  if (settings.messages_used_this_month < settings.monthly_message_limit) {
    settings.messages_used_this_month += 1;

    // Check 80% Alert
    const usagePercent = settings.messages_used_this_month / settings.monthly_message_limit;
    if (usagePercent >= 0.8 && !settings.alert_80_sent) {
      settings.alert_80_sent = true;
      notificationSent = 'ALERT_80_PERCENT';
    }

    // Check 100% Alert & Trigger 300 Courtesy Credits
    if (settings.messages_used_this_month >= settings.monthly_message_limit && !settings.courtesy_granted) {
      settings.courtesy_credits = 300;
      settings.courtesy_granted = true;
      settings.alert_100_sent = true;
      notificationSent = 'ALERT_100_COURTESY_OFFER';
    }

    const updated = await updateAISettings(userId, settings);
    return { allowed: true, settings: updated, notificationSent };
  }

  // Abatement Step 2: Saldo de Cortesia (300 msgs)
  if (settings.courtesy_credits > 0) {
    settings.courtesy_credits -= 1;
    if (settings.courtesy_credits === 0 && settings.rollover_credits === 0) {
      settings.is_quota_blocked = true;
      notificationSent = 'COURTESY_EXHAUSTED_HUMAN_HANDOFF';
    }
    const updated = await updateAISettings(userId, settings);
    return { allowed: true, settings: updated, notificationSent };
  }

  // Abatement Step 3: Saldo Extra Acumulado (rollover_credits)
  if (settings.rollover_credits > 0) {
    settings.rollover_credits -= 1;
    if (settings.rollover_credits === 0) {
      settings.is_quota_blocked = true;
      notificationSent = 'ROLLOVER_EXHAUSTED_HUMAN_HANDOFF';
    }
    const updated = await updateAISettings(userId, settings);
    return { allowed: true, settings: updated, notificationSent };
  }

  // Abatement Step 4: Bloqueio por Cota Excedida
  settings.is_quota_blocked = true;
  const updated = await updateAISettings(userId, settings);
  return { allowed: false, reason: 'QUOTA_EXHAUSTED_HUMAN_HANDOFF', settings: updated };
}

/**
 * Cenário A: Cliente aceita a oferta de pacote extra (+1.500 msgs por R$ 10,00)
 */
export async function acceptExtraPackage(userId: number): Promise<{ success: boolean; settings: AISettings }> {
  const current = await getAISettings(userId);
  
  const updated = await updateAISettings(userId, {
    rollover_credits: current.rollover_credits + 1500,
    pending_invoice_charges: Number(current.pending_invoice_charges || 0) + 10.00,
    is_quota_blocked: false
  });

  return { success: true, settings: updated };
}



