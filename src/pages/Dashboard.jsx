import { useState, useEffect, useMemo } from "react"
import { storage } from "../utils/storage"
import { useDebounce } from "../utils/debounce"
import { Chatroom } from "./Chatroom"
import { ChatroomSkeleton } from "../components/loadingSkeleton"
import { ThemeProvider, useTheme } from "../contexts/themeContext"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../redux/authSlice"
import { useSelector } from "react-redux"
import { Menu, Plus, Search, LogOut, Sun, Moon, MoreVertical } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function DashboardContent() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const userData = useSelector((state) => state.auth.user)
  const [chatrooms, setChatrooms] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChatroom, setSelectedChatroom] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [chatroomToDelete, setChatroomToDelete] = useState(null)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const userId = userData ? `${userData.countryCode}${userData.phoneNumber}` : null

  // Check if mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
      document.body.style.height = "100%"
    } else {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.height = ""
    }

    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.height = ""
    }
  }, [isMobile, sidebarOpen])

  useEffect(() => {
    if (!userId) return
    setIsLoading(true)
    setTimeout(() => {
      const savedChatrooms = storage.getChatrooms(userId)
      if (savedChatrooms.length === 0) {
        const defaultChatrooms = [
          {
            id: "chatroom_1",
            title: "New conversation",
            lastMessage: "Hello! How can I help you today?",
            timestamp: Date.now(),
            pinned: false,
          },
        ]
        setChatrooms(defaultChatrooms)
        storage.setChatrooms(userId, defaultChatrooms)
      } else {
        setChatrooms(savedChatrooms)
      }
      setIsLoading(false)
    }, 500)
  }, [userId])

  // Filter and sort chatrooms (pinned first)
  const filteredChatrooms = useMemo(() => {
    let filtered = chatrooms
    if (debouncedSearchQuery) {
      filtered = chatrooms.filter((chatroom) =>
        chatroom.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
      )
    }
    // Sort: pinned first, then by timestamp
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return b.timestamp - a.timestamp
    })
  }, [chatrooms, debouncedSearchQuery])

  // Create new chatroom
  const createChatroom = () => {
    const newChatroom = {
      id: `chatroom_${Date.now()}`,
      title: "New conversation",
      lastMessage: "New conversation started",
      timestamp: Date.now(),
      pinned: false,
    }
    const updatedChatrooms = [newChatroom, ...chatrooms]
    setChatrooms(updatedChatrooms)
    storage.setChatrooms(userId, updatedChatrooms)
    setSelectedChatroom(newChatroom.id)
    toast.success("New conversation started")
    if (isMobile) setSidebarOpen(false)
  }

  // Update chatroom title
  const updateChatroomTitle = (chatroomId, newTitle) => {
    const updatedChatrooms = chatrooms.map((room) => (room.id === chatroomId ? { ...room, title: newTitle } : room))
    setChatrooms(updatedChatrooms)
    storage.setChatrooms(userId, updatedChatrooms)
  }

  // Toggle pin chatroom
  const togglePinChatroom = (chatroomId) => {
    const updatedChatrooms = chatrooms.map((room) =>
      room.id === chatroomId ? { ...room, pinned: !room.pinned } : room,
    )
    setChatrooms(updatedChatrooms)
    storage.setChatrooms(userId, updatedChatrooms)
    const chatroom = chatrooms.find((room) => room.id === chatroomId)
    toast.success(chatroom?.pinned ? "Conversation unpinned" : "Conversation pinned")
    setActiveDropdown(null)
  }

  // Delete chatroom
  const deleteChatroom = (chatroomId) => {
    const updatedChatrooms = chatrooms.filter((room) => room.id !== chatroomId)
    setChatrooms(updatedChatrooms)
    storage.setChatrooms(userId, updatedChatrooms)
    localStorage.removeItem(`gemini-messages_${userData?.phoneNumber}_${chatroomId}`)
    if (selectedChatroom === chatroomId) {
      setSelectedChatroom(null)
    }
    toast.success("Conversation deleted")
    setActiveDropdown(null)
  }

  // Logout function
  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  // Handle sidebar behavior (desktop only)
  const handleSidebarMouseEnter = () => {
    if (!isMobile) {
      setSidebarOpen(true)
    }
  }

  const handleSidebarMouseLeave = () => {
    if (!isMobile) {
      setSidebarOpen(false)
    }
  }

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0F0F0F] overflow-hidden">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Hidden on mobile, normal behavior on desktop */}
      <div
        className={`${
          isMobile ? (sidebarOpen ? "fixed inset-y-0 left-0 w-80 z-50" : "hidden") : "relative flex-shrink-0"
        } transition-all duration-300 ease-in-out ${
          !isMobile && (sidebarOpen ? "w-80" : "w-16")
        } border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-[#1A1A1A] overflow-hidden`}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => (isMobile ? setSidebarOpen(false) : setSidebarOpen(!sidebarOpen))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={isMobile ? "Close sidebar" : sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div
              className={`flex items-center gap-3 transition-all duration-300 ${
                sidebarOpen || isMobile ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 className="text-xl font-medium text-gray-900 dark:text-white">Gemini</h1>
            </div>
          </div>
          <button
            onClick={createChatroom}
            className={`w-full mt-4 p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 flex items-center gap-3 text-left ${
              sidebarOpen || isMobile ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-900 dark:text-white">New conversation</span>
          </button>
        </div>

        {/* Search */}
        <div
          className={`p-4 flex-shrink-0 transition-opacity duration-300 ${
            sidebarOpen || isMobile ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div
          className={`flex-1 overflow-y-auto transition-opacity duration-300 ${
            sidebarOpen || isMobile ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {isLoading ? (
            <ChatroomSkeleton />
          ) : (
            <div className="px-2 pb-4">
              {filteredChatrooms.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {searchQuery ? "No conversations found" : "No conversations yet"}
                  </p>
                </div>
              ) : (
                filteredChatrooms.map((chatroom) => (
                  <div
                    key={chatroom.id}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                      selectedChatroom === chatroom.id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      setSelectedChatroom(chatroom.id)
                      if (isMobile) setSidebarOpen(false)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {chatroom.pinned && <span className="text-yellow-500 text-xs">📌</span>}
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{chatroom.title}</h3>
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveDropdown(activeDropdown === chatroom.id ? null : chatroom.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all ml-2"
                          title="More options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeDropdown === chatroom.id && (
                          <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                togglePinChatroom(chatroom.id)
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                              📌 {chatroom.pinned ? "Unpin" : "Pin"}
                            </button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setChatroomToDelete(chatroom.id)
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                  🗑️ Delete
                                </button>
                              </DialogTrigger>
                              <Dialog
                                open={!!chatroomToDelete}
                                onOpenChange={(open) => !open && setChatroomToDelete(null)}
                              >
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Conversation</DialogTitle>
                                  </DialogHeader>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Are you sure you want to delete this conversation? This action cannot be undone.
                                  </p>
                                  <DialogFooter className="mt-4">
                                    <DialogClose asChild>
                                      <Button variant="outline" onClick={() => setChatroomToDelete(null)}>
                                        Cancel
                                      </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <Button
                                        variant="destructive"
                                        onClick={() => {
                                          deleteChatroom(chatroomToDelete)
                                          setChatroomToDelete(null)
                                        }}
                                      >
                                        Delete
                                      </Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </Dialog>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Fixed Sidebar Footer */}
        <div
          className={`p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0 transition-opacity duration-300 ${
            sidebarOpen || isMobile ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {userData && (
            <div className="flex items-center gap-3 mb-3 flex-1 min-w-0">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {userData.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white truncate">{userData.name || "User"}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Hamburger Menu - Only visible on mobile */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] md:hidden">
            <button
              onClick={toggleMobileSidebar}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">Gemini</h1>
            </div>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        )}

        {selectedChatroom ? (
          <Chatroom
            userId={`${userData?.countryCode}${userData?.phoneNumber}`}
            chatroomId={selectedChatroom}
            chatroomTitle={chatrooms.find((room) => room.id === selectedChatroom)?.title || "Chatroom"}
            onBack={() => setSelectedChatroom(null)}
            onTitleUpdate={updateChatroomTitle}
            isMobile={isMobile}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-[#0F0F0F] p-4">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h2 className="text-3xl font-medium text-gray-900 dark:text-white mb-4">
                Hello, {userData?.name || "there"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                I'm Google's most capable AI model, built to be helpful, harmless, and honest. I can assist with
                writing, analysis, math, coding, and creative tasks.
              </p>
              <button
                onClick={createChatroom}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
              >
                Start a new conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  )
}
