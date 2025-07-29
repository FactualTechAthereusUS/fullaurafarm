'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Inbox, 
  Send, 
  File, 
  Trash, 
  Star, 
  Archive,
  Settings,
  Search,
  Plus,
  RefreshCw,
  User,
  Menu,
  X
} from 'lucide-react'
import { cn, formatDate, getInitials } from '@/lib/utils'

// Types
interface Email {
  id: number
  from_email: string
  to_email: string
  subject: string
  body: string
  is_read: boolean
  has_attachments: boolean
  created_at: string
  priority: 'low' | 'normal' | 'high'
}

interface User {
  id: number
  email: string
  profile: {
    full_name?: string
  }
}

const API_URL = 'https://api.aurafarming.co'

export default function WebmailPage() {
  const [user, setUser] = useState<User | null>(null)
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [activeFolder, setActiveFolder] = useState('inbox')
  const [isComposing, setIsComposing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock login for now - we'll integrate proper auth later
  useEffect(() => {
    setUser({
      id: 21,
      email: 'alladin@aurafarming.co',
      profile: { full_name: 'Alladin AuraFarming' }
    })
  }, [])

  // Fetch emails
  const fetchEmails = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/emails/inbox/${user.id}`)
      const data = await response.json()
      if (data.success) {
        setEmails(data.emails || [])
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error)
      // Mock data for development
      setEmails([
        {
          id: 1,
          from_email: 'welcome@aurafarming.co',
          to_email: user.email,
          subject: 'Welcome to AuraMail! 🎉',
          body: `<h2>Welcome to AuraMail, ${user.profile.full_name}!</h2><p>Your professional email account has been created successfully.</p>`,
          is_read: false,
          has_attachments: false,
          created_at: new Date().toISOString(),
          priority: 'normal'
        },
        {
          id: 2,
          from_email: 'noreply@github.com',
          to_email: user.email,
          subject: 'Your GitHub security alert',
          body: 'We detected a new sign-in to your account from a new device.',
          is_read: true,
          has_attachments: false,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          priority: 'high'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchEmails()
    }
  }, [user, activeFolder])

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: Inbox, count: emails.filter(e => !e.is_read).length },
    { id: 'starred', name: 'Starred', icon: Star, count: 0 },
    { id: 'sent', name: 'Sent', icon: Send, count: 0 },
    { id: 'drafts', name: 'Drafts', icon: File, count: 0 },
    { id: 'archive', name: 'Archive', icon: Archive, count: 0 },
    { id: 'trash', name: 'Trash', icon: Trash, count: 0 },
  ]

  const Sidebar = () => (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "w-64 bg-card border-r border-border h-full flex flex-col",
        !sidebarOpen && "hidden lg:flex"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-lg">AuraMail</h1>
        </div>
        
        <button
          onClick={() => setIsComposing(true)}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 justify-center font-medium"
        >
          <Plus className="w-4 h-4" />
          Compose
        </button>
      </div>

      {/* Folders */}
      <div className="flex-1 p-2 custom-scrollbar overflow-y-auto">
        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => setActiveFolder(folder.id)}
            className={cn(
              "sidebar-item",
              activeFolder === folder.id && "sidebar-item-active"
            )}
          >
            <folder.icon className="w-4 h-4" />
            <span className="flex-1">{folder.name}</span>
            {folder.count > 0 && (
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                {folder.count}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user ? getInitials(user.profile.full_name || user.email) : 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.profile.full_name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          <Settings className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
        </div>
      </div>
    </motion.div>
  )

  const EmailList = () => (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Search and toolbar */}
      <div className="p-4 border-b border-border">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <h2 className="font-semibold capitalize">{activeFolder}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchEmails}
              disabled={isLoading}
              className="p-1 hover:bg-muted rounded"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1 hover:bg-muted rounded"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Email list */}
      <div className="flex-1 custom-scrollbar overflow-y-auto">
        {emails.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No emails in {activeFolder}</p>
          </div>
        ) : (
          emails.map((email) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedEmail(email)}
              className={cn(
                "email-item p-4",
                !email.is_read && "unread",
                selectedEmail?.id === email.id && "bg-accent"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium">
                    {getInitials(email.from_email)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={cn(
                      "text-sm truncate",
                      !email.is_read && "font-semibold"
                    )}>
                      {email.from_email}
                    </p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDate(email.created_at)}
                    </span>
                  </div>
                  
                  <p className={cn(
                    "text-sm truncate mb-1",
                    !email.is_read && "font-medium"
                  )}>
                    {email.subject}
                  </p>
                  
                  <p className="text-xs text-muted-foreground truncate">
                    {email.body.replace(/<[^>]*>/g, '')}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    {email.has_attachments && (
                      <File className="w-3 h-3 text-muted-foreground" />
                    )}
                    {email.priority === 'high' && (
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                    {!email.is_read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )

  const EmailView = () => (
    <div className="flex-1 flex flex-col bg-background">
      {selectedEmail ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col"
        >
          {/* Email header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold mb-2">{selectedEmail.subject}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>From: {selectedEmail.from_email}</span>
                  <span>To: {selectedEmail.to_email}</span>
                  <span>{formatDate(selectedEmail.created_at)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-muted rounded">
                  <Archive className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-muted rounded">
                  <Trash className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-muted rounded">
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Email content */}
          <div className="flex-1 p-6 custom-scrollbar overflow-y-auto">
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
            />
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Mail className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg mb-2">No email selected</p>
            <p className="text-sm">Choose an email from the list to read it</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="h-screen flex bg-background text-foreground">
      {/* Mobile sidebar overlay */}
      {!sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={() => setSidebarOpen(true)}
        />
      )}
      
      <Sidebar />
      <EmailList />
      <EmailView />

      {/* Compose Modal - placeholder for now */}
      {isComposing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[80vh] compose-dialog"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">Compose Email</h3>
              <button
                onClick={() => setIsComposing(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-muted-foreground">Compose functionality coming soon...</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
