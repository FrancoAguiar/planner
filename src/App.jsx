import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, CalendarDays, AlignLeft, Grid3X3, 
  Settings, CheckCircle2, LayoutTemplate, Plus, 
  Bell, Search, User, MoreHorizontal, Image as ImageIcon,
  GripHorizontal, CheckSquare, LogOut, Loader2
} from 'lucide-react';

// --- MOCK DATA INICIAL ---
const initialPosts = [
  {
    id: '1',
    date: '2026-04-02',
    image: '[https://picsum.photos/seed/post1/400/400](https://picsum.photos/seed/post1/400/400)',
    copy: '¡Lanzamiento de nuestra nueva herramienta! 🚀\n\nDescubre cómo ahorrar horas de trabajo con SocialPlanner.\n\n#SaaS #Productividad #Marketing',
    status: 'scheduled',
    checklist: { design: true, copy: true, hashtags: true, approved: false }
  },
  {
    id: '2',
    date: '2026-04-05',
    image: '[https://picsum.photos/seed/post2/400/400](https://picsum.photos/seed/post2/400/400)',
    copy: '3 tips para organizar tu contenido semanal 📅\n\n1. Usa bloques temporales.\n2. Recicla contenido antiguo.\n3. Usa una herramienta centralizada.\n\n#Tips #Organizacion',
    status: 'draft',
    checklist: { design: true, copy: false, hashtags: false, approved: false }
  },
  {
    id: '3',
    date: '2026-04-08',
    image: '[https://picsum.photos/seed/post3/400/400](https://picsum.photos/seed/post3/400/400)',
    copy: 'Detrás de escena de nuestro equipo de desarrollo 💻✨\n\n#BehindTheScenes #TechTeam',
    status: 'published',
    checklist: { design: true, copy: true, hashtags: true, approved: true }
  }
];

export default function SocialPlannerApp() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [posts, setPosts] = useState(initialPosts);
  const [showAuthScreen, setShowAuthScreen] = useState(true);

  // Funciones globales para actualizar datos
  const handleUpdateAllPosts = (newPosts) => {
    setPosts(newPosts);
    // Aquí iría la lógica para guardar en BD cuando conectes Firebase
  };

  const updatePost = (updatedPost) => {
    const newPosts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
    handleUpdateAllPosts(newPosts);
  };

  const handleLogout = () => {
    setShowAuthScreen(true);
  };

  if (showAuthScreen) {
    return <AuthScreen onEnter={() => setShowAuthScreen(false)} />;
  }

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <DashboardView posts={posts} setView={setCurrentView} />;
      case 'calendar': return <CalendarView posts={posts} />;
      case 'copys': return <CopysManager posts={posts} updatePost={updatePost} />;
      case 'feed': return <FeedVisualizer posts={posts} handleUpdateAllPosts={handleUpdateAllPosts} />;
      case 'templates': return <TemplatesView />;
      default: return <DashboardView posts={posts} setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans overflow-hidden selection:bg-blue-500/30">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

// --- SIDEBAR ---
function Sidebar({ currentView, setCurrentView, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendario', icon: CalendarDays },
    { id: 'copys', label: 'Gestor de Copys', icon: AlignLeft },
    { id: 'feed', label: 'Feed Visual', icon: Grid3X3 },
    { id: 'templates', label: 'Plantillas', icon: LayoutTemplate },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-[#0A0A0A] flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] mr-3">
          <LayoutDashboard className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">SocialPlanner<span className="text-blue-500">.</span></span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Menú Principal</div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all">
          <Settings className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-sm">Ajustes</span>
        </button>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mt-2">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

// --- HEADER ---
function Header() {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 w-64">
        <Search className="w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Buscar publicaciones..." className="bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-500 w-full" />
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Post
        </button>
      </div>
    </header>
  );
}

// --- VISTAS DEL DASHBOARD ---

function DashboardView({ posts, setView }) {
  const stats = [
    { label: 'Programados', value: posts.filter(p => p.status === 'scheduled').length, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
    { label: 'Borradores', value: posts.filter(p => p.status === 'draft').length, color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10' },
    { label: 'Publicados', value: posts.filter(p => p.status === 'published').length, color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white mb-2">Hola, Agencia Nova 👋</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-sm relative overflow-hidden`}>
            <div className="relative z-10">
              <div className="text-gray-300 font-medium mb-1">{stat.label}</div>
              <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarView({ posts }) {
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-6">Calendario de Contenido</h1>
      <div className="flex-1 bg-[#141414] border border-white/10 rounded-xl p-8 flex items-center justify-center text-gray-500">
        <CalendarDays className="w-12 h-12 mb-4 opacity-50" />
        <p>Vista de calendario en construcción...</p>
      </div>
    </div>
  );
}

function CopysManager({ posts, updatePost }) {
  const [activePostId, setActivePostId] = useState(posts[0]?.id);
  const activePost = posts.find(p => p.id === activePostId);

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-6">Gestor de Copys</h1>
      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-1/3 flex flex-col gap-3 overflow-y-auto">
          {posts.map(post => (
            <div key={post.id} onClick={() => setActivePostId(post.id)} className={`p-4 rounded-xl border cursor-pointer ${activePostId === post.id ? 'bg-blue-500/10 border-blue-500/50' : 'bg-[#141414] border-white/10'}`}>
              <div className="text-sm font-medium text-white truncate">{post.copy ? post.copy.split('\n')[0] : 'Sin copy escrito'}</div>
            </div>
          ))}
        </div>
        {activePost && (
          <div className="flex-1 bg-[#141414] border border-white/10 rounded-xl p-6 flex flex-col">
            <textarea 
              value={activePost.copy}
              onChange={(e) => updatePost({ ...activePost, copy: e.target.value })}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-gray-200 resize-none outline-none focus:border-blue-500/50"
              placeholder="Escribe el copy aquí..."
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FeedVisualizer({ posts, handleUpdateAllPosts }) {
  const [gridItems, setGridItems] = useState([...posts].reverse());

  useEffect(() => { setGridItems([...posts].reverse()); }, [posts]);

  return (
    <div className="h-full flex flex-col items-center">
      <h1 className="text-2xl font-bold text-white mb-8">Visualizador de Feed</h1>
      <div className="bg-white px-2 pt-12 pb-2 rounded-[2.5rem] border-8 border-gray-900 w-[320px]">
        <div className="grid grid-cols-3 gap-0.5">
          {gridItems.map((item, index) => (
            <div key={item.id} className="aspect-square bg-gray-200">
              <img src={item.image} alt="Feed thumbnail" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplatesView() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Plantillas</h1>
      <p className="text-gray-400">Aquí irán tus plantillas guardadas.</p>
    </div>
  );
}

// --- AUTH UI ---
function AuthScreen({ onEnter }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onEnter(); }, 1200);
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] items-center justify-center">
      <div className="w-full max-w-md p-8 bg-[#141414]/80 border border-white/10 rounded-3xl text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Bienvenido de nuevo' : 'Crea tu Workspace'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <input type="email" required className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="ejemplo@agencia.com" />
          <input type="password" required className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="••••••••" />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl">
            {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>
      </div>
    </div>
  );
}
