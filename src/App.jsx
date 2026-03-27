import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, CalendarDays, AlignLeft, Grid3X3, 
  Settings, CheckCircle2, LayoutTemplate, Plus, 
  Bell, Search, User, MoreHorizontal, Image as ImageIcon,
  GripHorizontal, CheckSquare, LogOut, Loader2, Trash2
} from 'lucide-react';

// --- MOCK DATA INICIAL ---
const getTodayDate = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

const initialPosts = [
  {
    id: '1',
    date: getTodayDate(1),
    image: '[https://picsum.photos/seed/post1/400/400](https://picsum.photos/seed/post1/400/400)',
    copy: '¡Lanzamiento de nuestra nueva herramienta! 🚀\n\nDescubre cómo ahorrar horas de trabajo con SocialPlanner.\n\n#SaaS #Productividad #Marketing',
    status: 'scheduled',
    checklist: { design: true, copy: true, hashtags: true, approved: false }
  },
  {
    id: '2',
    date: getTodayDate(4),
    image: '[https://picsum.photos/seed/post2/400/400](https://picsum.photos/seed/post2/400/400)',
    copy: '3 tips para organizar tu contenido semanal 📅\n\n1. Usa bloques temporales.\n2. Recicla contenido antiguo.\n3. Usa una herramienta centralizada.\n\n#Tips #Organizacion',
    status: 'draft',
    checklist: { design: true, copy: false, hashtags: false, approved: false }
  },
  {
    id: '3',
    date: getTodayDate(-2),
    image: '[https://picsum.photos/seed/post3/400/400](https://picsum.photos/seed/post3/400/400)',
    copy: 'Detrás de escena de nuestro equipo de desarrollo 💻✨\n\n#BehindTheScenes #TechTeam',
    status: 'published',
    checklist: { design: true, copy: true, hashtags: true, approved: true }
  }
];

export default function SocialPlannerApp() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAuthScreen, setShowAuthScreen] = useState(true);
  
  // Lógica de Persistencia (Local Storage)
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('socialplanner_posts');
    if (saved) return JSON.parse(saved);
    return initialPosts;
  });

  useEffect(() => {
    localStorage.setItem('socialplanner_posts', JSON.stringify(posts));
  }, [posts]);

  // Funciones CRUD
  const handleUpdateAllPosts = (newPosts) => {
    setPosts(newPosts);
  };

  const updatePost = (updatedPost) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const createPost = () => {
    const newPost = {
      id: Date.now().toString(),
      date: getTodayDate(),
      image: `https://picsum.photos/seed/${Date.now()}/400/400`,
      copy: 'Nuevo post sin título',
      status: 'draft',
      checklist: { design: false, copy: false, hashtags: false, approved: false }
    };
    setPosts([newPost, ...posts]);
    setCurrentView('copys'); // Redirigir al editor
  };

  const deletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const handleLogout = () => {
    setShowAuthScreen(true);
  };

  if (showAuthScreen) {
    return <AuthScreen onEnter={() => setShowAuthScreen(false)} />;
  }

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <DashboardView posts={posts} setView={setCurrentView} createPost={createPost} />;
      case 'calendar': return <CalendarView posts={posts} />;
      case 'copys': return <CopysManager posts={posts} updatePost={updatePost} deletePost={deletePost} />;
      case 'feed': return <FeedVisualizer posts={posts} handleUpdateAllPosts={handleUpdateAllPosts} />;
      case 'templates': return <TemplatesView createPost={createPost} />;
      default: return <DashboardView posts={posts} setView={setCurrentView} createPost={createPost} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans overflow-hidden selection:bg-blue-500/30">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header createPost={createPost} />
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
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
    <aside className="w-64 border-r border-white/10 bg-[#0A0A0A] flex flex-col z-20">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] mr-3">
          <LayoutDashboard className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">SocialPlanner<span className="text-blue-500">.</span></span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
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
        <div className="mt-2 flex items-center gap-3 px-3 py-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-[#0A0A0A] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium text-white truncate">Usuario Pro</div>
            <div className="text-xs text-gray-500 truncate">Plan Premium</div>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

// --- HEADER ---
function Header({ createPost }) {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 w-64">
        <Search className="w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Buscar publicaciones..." className="bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-500 w-full" />
      </div>
      <div className="flex items-center gap-4">
        <button onClick={createPost} className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          <Plus className="w-4 h-4" /> Nuevo Post
        </button>
      </div>
    </header>
  );
}

// --- VISTAS DEL DASHBOARD ---

function DashboardView({ posts, setView, createPost }) {
  const stats = [
    { label: 'Programados', value: posts.filter(p => p.status === 'scheduled').length, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
    { label: 'Borradores', value: posts.filter(p => p.status === 'draft').length, color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10' },
    { label: 'Publicados', value: posts.filter(p => p.status === 'published').length, color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Resumen de tu cuenta 👋</h1>
        <p className="text-gray-400">Control total sobre el estado de tu contenido.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-sm relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer`}>
            <div className="relative z-10">
              <div className="text-gray-300 font-medium mb-1">{stat.label}</div>
              <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors"></div>
          </div>
        ))}
      </div>

      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Actividad Reciente</h2>
          <button onClick={() => setView('copys')} className="text-sm text-blue-400 hover:text-blue-300">Ver todo</button>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No tienes publicaciones aún.</p>
            <button onClick={createPost} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors text-sm">Crear la primera</button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.slice(0, 4).map(post => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800">
                    <img src={post.image} alt="post" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm truncate max-w-[200px] md:max-w-md">{post.copy.split('\n')[0] || 'Sin texto'}</h3>
                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> {post.date}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${post.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : post.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// FUNCIONALIDAD: Calendario Dinámico
function CalendarView({ posts }) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // Ajustar para que la semana empiece en Lunes
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const blanks = Array.from({ length: startDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendario de {monthNames[currentMonth]} {currentYear}</h1>
          <p className="text-sm text-gray-400">Tus publicaciones organizadas por fecha.</p>
        </div>
      </div>

      <div className="flex-1 bg-[#141414] border border-white/10 rounded-xl flex flex-col overflow-hidden">
        <div className="grid grid-cols-7 border-b border-white/10 bg-[#0A0A0A]/50 shrink-0">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="p-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider border-r border-white/10 last:border-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 auto-rows-fr overflow-y-auto">
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="border-r border-b border-white/5 bg-black/20 p-2 min-h-[100px]"></div>
          ))}
          {days.map(day => {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayPosts = posts.filter(p => p.date === dateStr);
            const isToday = dateStr === currentDate.toISOString().split('T')[0];
            
            return (
              <div key={day} className={`border-r border-b border-white/5 p-2 transition-colors min-h-[100px] flex flex-col relative group ${isToday ? 'bg-blue-500/5' : 'hover:bg-white/[0.02]'}`}>
                <span className={`text-sm font-medium mb-1 inline-block w-6 h-6 text-center leading-6 rounded-full ${isToday ? 'bg-blue-500 text-white' : 'text-gray-500'}`}>{day}</span>
                
                <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
                  {dayPosts.map(post => (
                    <div key={post.id} className={`text-xs p-1.5 rounded border ${
                      post.status === 'published' ? 'bg-green-500/10 border-green-500/20 text-green-300' :
                      post.status === 'scheduled' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' :
                      'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'
                    } truncate shadow-sm`}>
                      {post.copy.split('\n')[0] || 'Post'}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// FUNCIONALIDAD: Gestor de Copys Real
function CopysManager({ posts, updatePost, deletePost }) {
  const [activePostId, setActivePostId] = useState(posts[0]?.id || null);
  const activePost = posts.find(p => p.id === activePostId);

  // Asegurar que siempre haya un post activo si existen posts
  useEffect(() => {
    if (!activePost && posts.length > 0) setActivePostId(posts[0].id);
  }, [posts, activePost]);

  const toggleChecklist = (key) => {
    if (!activePost) return;
    updatePost({
      ...activePost,
      checklist: { ...activePost.checklist, [key]: !activePost.checklist[key] }
    });
  };

  const handleStatusChange = (e) => {
    updatePost({ ...activePost, status: e.target.value });
  };

  const handleDateChange = (e) => {
    updatePost({ ...activePost, date: e.target.value });
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Gestor de Copys y Aprobaciones</h1>
        <p className="text-sm text-gray-400">Edita textos y marca checklists. Los cambios se guardan automáticamente.</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        <div className="w-full lg:w-1/3 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 pb-4">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No hay posts. Crea uno nuevo.</p>
          ) : (
            posts.map(post => (
              <div key={post.id} onClick={() => setActivePostId(post.id)} className={`p-4 rounded-xl border cursor-pointer transition-all ${activePostId === post.id ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-[#141414] border-white/10 hover:border-white/20'}`}>
                <div className="flex gap-3 mb-2">
                  <img src={post.image} alt="thumb" className="w-12 h-12 rounded object-cover border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{post.copy ? post.copy.split('\n')[0] : 'Sin texto'}</div>
                    <div className="text-xs text-gray-500 flex justify-between mt-1">
                      <span>{post.date}</span>
                      <span className={post.status === 'published' ? 'text-green-400' : post.status === 'scheduled' ? 'text-blue-400' : 'text-yellow-400'}>{post.status}</span>
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex mt-2">
                  {Object.values(post.checklist).map((isChecked, i) => (
                    <div key={i} className={`h-full flex-1 border-r border-black/20 ${isChecked ? 'bg-blue-500' : 'bg-transparent'}`} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {activePost ? (
          <div className="flex-1 bg-[#141414] border border-white/10 rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex items-center gap-4">
                <input type="date" value={activePost.date} onChange={handleDateChange} className="bg-[#0A0A0A] border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                <select value={activePost.status} onChange={handleStatusChange} className="bg-[#0A0A0A] border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                  <option value="draft">Borrador</option>
                  <option value="scheduled">Programado</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
              <button onClick={() => deletePost(activePost.id)} className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors" title="Eliminar post">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 flex flex-col lg:flex-row gap-8 overflow-y-auto custom-scrollbar">
              <div className="flex-1 flex flex-col">
                <label className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-blue-400" /> Texto de la publicación (Copy)
                </label>
                <textarea 
                  value={activePost.copy}
                  onChange={(e) => updatePost({ ...activePost, copy: e.target.value })}
                  className="flex-1 min-h-[300px] bg-white/5 border border-white/10 rounded-xl p-4 text-gray-200 resize-none outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 custom-scrollbar leading-relaxed"
                  placeholder="Escribe el texto persuasivo aquí..."
                />
              </div>

              <div className="w-full lg:w-72 flex flex-col gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-300 mb-2 block">Imagen</label>
                  <div className="aspect-square rounded-xl overflow-hidden border border-white/10 relative group">
                    <img src={activePost.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded text-sm backdrop-blur-sm transition-colors">Cambiar</button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-purple-400" /> Checklist Pre-Publicación
                  </label>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2 space-y-1">
                    {[
                      { key: 'design', label: 'Diseño completado' },
                      { key: 'copy', label: 'Copy redactado' },
                      { key: 'hashtags', label: 'Hashtags incluidos' },
                      { key: 'approved', label: 'Aprobado por cliente' },
                    ].map(({ key, label }) => (
                      <button 
                        key={key} 
                        onClick={() => toggleChecklist(key)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors text-left group"
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${activePost.checklist[key] ? 'bg-blue-500 border-blue-500' : 'border-gray-500 group-hover:border-gray-400'}`}>
                          {activePost.checklist[key] && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm ${activePost.checklist[key] ? 'text-gray-200 line-through opacity-70' : 'text-gray-300'}`}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#141414] border border-white/5 rounded-xl">
            <p className="text-gray-500">Selecciona o crea un post para editar.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// FUNCIONALIDAD: Drag & Drop Real para Feed
function FeedVisualizer({ posts, handleUpdateAllPosts }) {
  const [gridItems, setGridItems] = useState([...posts]);

  useEffect(() => { setGridItems([...posts]); }, [posts]);

  const onDragStart = (e, index) => {
    e.dataTransfer.setData('draggedIndex', index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = e.dataTransfer.getData('draggedIndex');
    if(sourceIndex === targetIndex.toString()) return;

    const newItems = [...gridItems];
    const draggedItem = newItems[sourceIndex];
    
    // Remover del origen y insertar en destino
    newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    
    setGridItems(newItems);
    handleUpdateAllPosts(newItems); // Guardar el nuevo orden globalmente
  };

  return (
    <div className="h-full flex flex-col items-center animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Visualizador de Perfil</h1>
        <p className="text-sm text-gray-400">Mantén presionado y arrastra las imágenes para ordenar tu grid.</p>
      </div>

      <div className="bg-white px-1 pt-12 pb-1 rounded-[2.5rem] border-8 border-gray-900 w-[340px] shadow-2xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-10"></div>
        
        <div className="px-4 py-2 mb-2 flex items-center justify-between">
          <span className="text-black font-bold text-lg">mi_marca_pro</span>
          <MoreHorizontal className="text-black w-6 h-6" />
        </div>

        <div className="px-4 mb-4 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 border border-gray-300 p-0.5 shrink-0">
            <img src="[https://ui-avatars.com/api/?name=Marca&background=random](https://ui-avatars.com/api/?name=Marca&background=random)" className="w-full h-full rounded-full object-cover" alt="profile"/>
          </div>
          <div className="flex flex-1 justify-between text-black text-center">
            <div><p className="font-bold text-lg">{gridItems.length}</p><p className="text-xs">Posts</p></div>
            <div><p className="font-bold text-lg">10K</p><p className="text-xs">Followers</p></div>
            <div><p className="font-bold text-lg">250</p><p className="text-xs">Following</p></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-0.5 bg-white">
          {gridItems.map((item, index) => (
            <div 
              key={item.id} 
              draggable
              onDragStart={(e) => onDragStart(e, index)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, index)}
              className="aspect-square bg-gray-200 cursor-grab active:cursor-grabbing relative group hover:opacity-90 transition-opacity"
            >
              <img src={item.image} alt={`Feed ${index}`} className="w-full h-full object-cover pointer-events-none" />
              <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity border-2 border-blue-500 pointer-events-none">
                <GripHorizontal className="text-white w-6 h-6 drop-shadow-md" />
              </div>
            </div>
          ))}
          {/* Rellenar espacios vacíos si hay menos de 9 posts para simular el celular */}
          {Array.from({ length: Math.max(0, 9 - gridItems.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-gray-100 border border-gray-200"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// FUNCIONALIDAD: Plantillas (Crean posts nuevos pre-rellenados)
function TemplatesView({ createPost }) {
  const templates = [
    { title: 'Testimonio Cliente', type: 'Carrusel', color: 'from-blue-500 to-cyan-500', desc: 'Plantilla para mostrar reviews de clientes satisfechos.' },
    { title: 'Tip Educativo', type: 'Reel Cover', color: 'from-purple-500 to-pink-500', desc: 'Formato vertical ideal para reels educativos de valor.' },
    { title: 'Frase Motivacional', type: 'Post Simple', color: 'from-orange-500 to-red-500', desc: 'Post minimalista para interactuar con la audiencia.' },
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Plantillas Base</h1>
          <p className="text-sm text-gray-400">Haz clic en una plantilla para generar un nuevo borrador rápidamente.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl, i) => (
          <div 
            key={i} 
            onClick={createPost}
            className="bg-[#141414] border border-white/10 rounded-xl p-5 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all group cursor-pointer transform hover:-translate-y-1"
          >
            <div className={`w-full h-32 rounded-lg bg-gradient-to-br ${tpl.color} mb-4 opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
               <LayoutTemplate className="w-10 h-10 text-white/50 group-hover:text-white/80 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{tpl.title}</h3>
            <p className="text-xs text-blue-400 font-medium mb-2">{tpl.type}</p>
            <p className="text-sm text-gray-500 leading-relaxed">{tpl.desc}</p>
            <button className="mt-4 w-full py-2 bg-white/5 rounded-lg text-sm text-white group-hover:bg-blue-600 transition-colors">
              Usar Plantilla
            </button>
          </div>
        ))}
      </div>
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
    setTimeout(() => { setLoading(false); onEnter(); }, 800); // Simular red rápida
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] items-center justify-center relative overflow-hidden">
      {/* Background Glow Premium */}
      <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-blue-900 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 pointer-events-none"></div>

      <div className="w-full max-w-md p-8 bg-[#141414]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-2">{isLogin ? 'Accede a tu Workspace' : 'Crea tu Workspace'}</h2>
        <p className="text-center text-gray-400 text-sm mb-8">{isLogin ? 'Retoma tu planificación donde la dejaste' : 'SaaS Mode: LocalStorage activado'}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
             <label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Email</label>
             <input type="email" required className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="tu@agencia.com" />
          </div>
          <div>
             <label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Contraseña</label>
             <input type="password" required className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] mt-2 flex justify-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta Libre')}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-blue-400 hover:text-blue-300 font-medium">
            {isLogin ? 'Regístrate' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
