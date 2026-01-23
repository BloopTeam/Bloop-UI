import { useState, useRef } from 'react'
import { X, ChevronRight, MoreHorizontal } from 'lucide-react'
import { ToastMessage } from './Toast'

interface EditorAreaProps {
  onShowToast?: (type: ToastMessage['type'], message: string) => void
}

interface Tab {
  id: string
  name: string
  path: string[]
  content: string
  modified?: boolean
}

export default function EditorArea({ onShowToast }: EditorAreaProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    { 
      id: '1', 
      name: 'App.tsx', 
      path: ['src', 'components'],
      modified: false,
      content: `import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Welcome to Bloop</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  )
}` 
    },
    { 
      id: '2', 
      name: 'seo_analyzer.py',
      path: ['src', 'utils'],
      modified: true, 
      content: `class SEOAnalyzer:
    def __init__(self, title, content):
        self.title = title
        self.content = content

    def score_title(self):
        length = len(self.title)
        if 50 <= length <= 60:
            return 10
        return 5` 
    },
  ])
  
  const [activeTab, setActiveTab] = useState('1')
  const [draggedTab, setDraggedTab] = useState<string | null>(null)
  const [dragOverTab, setDragOverTab] = useState<string | null>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const tab = tabs.find(t => t.id === tabId)
    const newTabs = tabs.filter(t => t.id !== tabId)
    
    if (newTabs.length > 0) {
      setTabs(newTabs)
      if (activeTab === tabId) {
        setActiveTab(newTabs[0].id)
      }
      onShowToast?.('info', `Closed ${tab?.name}`)
    }
  }

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    setDraggedTab(tabId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, tabId: string) => {
    e.preventDefault()
    if (draggedTab && draggedTab !== tabId) {
      setDragOverTab(tabId)
    }
  }

  const handleDragLeave = () => {
    setDragOverTab(null)
  }

  const handleDrop = (e: React.DragEvent, targetTabId: string) => {
    e.preventDefault()
    if (draggedTab && draggedTab !== targetTabId) {
      const newTabs = [...tabs]
      const draggedIndex = newTabs.findIndex(t => t.id === draggedTab)
      const targetIndex = newTabs.findIndex(t => t.id === targetTabId)
      
      const [removed] = newTabs.splice(draggedIndex, 1)
      newTabs.splice(targetIndex, 0, removed)
      
      setTabs(newTabs)
      onShowToast?.('info', 'Tab reordered')
    }
    setDraggedTab(null)
    setDragOverTab(null)
  }

  const handleDragEnd = () => {
    setDraggedTab(null)
    setDragOverTab(null)
  }

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0]

  const highlightSyntax = (line: string) => {
    const escaped = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    return escaped
      .replace(/(\/\/.*$|#.*$)/g, '<span style="color:#6a9955;font-style:italic;">$1</span>')
      .replace(/(['"`])(.*?)(\1)/g, '<span style="color:#ce9178;">$1$2$3</span>')
      .replace(
        /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|interface|type|new|this|async|await|def|elif|self|None|True|False)\b/g,
        '<span style="color:#c586c0;">$1</span>'
      )
      .replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, '<span style="color:#dcdcaa;">$1</span>')
      .replace(/\b\d+(\.\d+)?\b/g, '<span style="color:#b5cea8;">$&</span>')
  }

  const getFileIcon = (name: string) => {
    if (name.endsWith('.tsx') || name.endsWith('.ts')) return '⚛️'
    if (name.endsWith('.py')) return '🐍'
    if (name.endsWith('.js') || name.endsWith('.jsx')) return '📜'
    if (name.endsWith('.css')) return '🎨'
    if (name.endsWith('.json')) return '📋'
    if (name.endsWith('.md')) return '📝'
    return '📄'
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#0f0f0f',
      overflow: 'hidden'
    }}>
      {/* Tabs */}
      <div 
        ref={tabsRef}
        style={{
          display: 'flex',
          background: '#141414',
          borderBottom: '1px solid #1a1a1a',
          overflowX: 'auto',
          height: '42px',
          paddingLeft: '8px',
          gap: '2px'
        }}
      >
        {tabs.map(tab => {
          const isActive = tab.id === activeTab
          const isDragOver = tab.id === dragOverTab
          
          return (
            <div
              key={tab.id}
              draggable
              onDragStart={(e) => handleDragStart(e, tab.id)}
              onDragOver={(e) => handleDragOver(e, tab.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, tab.id)}
              onDragEnd={handleDragEnd}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 16px',
                backgroundColor: isActive ? '#0f0f0f' : (isDragOver ? '#1a1a1a' : 'transparent'),
                borderBottom: isActive ? '2px solid #FF00FF' : '2px solid transparent',
                borderLeft: isDragOver ? '2px solid #FF00FF' : '2px solid transparent',
                cursor: 'grab',
                fontSize: '13px',
                color: isActive ? '#cccccc' : '#858585',
                minWidth: '120px',
                position: 'relative',
                height: '42px',
                boxSizing: 'border-box',
                transition: 'background 0.1s',
                opacity: draggedTab === tab.id ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isActive && draggedTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = '#1a1a1a'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive && draggedTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <span style={{ fontSize: '12px' }}>{getFileIcon(tab.name)}</span>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px' 
              }}>
                {tab.name}
                {tab.modified && (
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: '#FF00FF',
                    marginLeft: '4px'
                  }} />
                )}
              </span>
              <button
                onClick={(e) => closeTab(tab.id, e)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#858585',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px',
                  marginLeft: 'auto',
                  opacity: 0.6,
                  transition: 'all 0.1s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#cccccc'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#858585'
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.opacity = '0.6'
                }}
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
        
        {/* More tabs indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          color: '#555',
          cursor: 'pointer'
        }}>
          <MoreHorizontal size={16} />
        </div>
      </div>

      {/* Breadcrumbs */}
      {currentTab && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 16px',
          background: '#0a0a0a',
          borderBottom: '1px solid #1a1a1a',
          fontSize: '12px',
          color: '#666'
        }}>
          {currentTab.path.map((segment, idx) => (
            <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span 
                style={{ 
                  cursor: 'pointer',
                  transition: 'color 0.1s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FF00FF'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
              >
                {segment}
              </span>
              <ChevronRight size={12} style={{ color: '#444' }} />
            </span>
          ))}
          <span style={{ color: '#ccc' }}>{currentTab.name}</span>
        </div>
      )}

      {/* Editor with line numbers */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
        fontSize: '14px',
        lineHeight: '1.7',
        color: '#cccccc',
        background: '#0f0f0f'
      }}>
        {/* Line Numbers */}
        <div style={{
          padding: '24px 16px 24px 24px',
          textAlign: 'right',
          color: '#444',
          userSelect: 'none',
          borderRight: '1px solid #1a1a1a',
          background: '#0a0a0a'
        }}>
          {currentTab.content.split('\n').map((_, idx) => (
            <div 
              key={idx}
              style={{ 
                height: '1.7em',
                cursor: 'pointer',
                transition: 'color 0.1s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FF00FF'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#444'}
              onClick={() => onShowToast?.('info', `Breakpoint toggled at line ${idx + 1}`)}
            >
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Code Content */}
        <div style={{
          flex: 1,
          padding: '24px 32px'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#cccccc' }}>
            <code>
              {currentTab.content.split('\n').map((line, idx) => (
                <div 
                  key={idx} 
                  style={{ height: '1.7em' }}
                  dangerouslySetInnerHTML={{ __html: highlightSyntax(line) || '&nbsp;' }} 
                />
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
