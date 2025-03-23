"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { format, subDays, eachDayOfInterval } from "date-fns"
import { useSound } from "use-sound"
import Image from "next/image"

// Define types for our lemon data
type LemonData = {
  stock: number
  consumed: number
  purchased: number
  dailyConsumption: Record<string, number>
}

// Initial data
const initialData: LemonData = {
  stock: 5,
  consumed: 0,
  purchased: 5,
  dailyConsumption: {},
}

export default function LemonCounter() {
  // State for lemon data
  const [data, setData] = useState<LemonData>(initialData)
  const [showStats, setShowStats] = useState(false)
  const [showAlert, setShowAlert] = useState(true)

  // Reset showAlert when stock changes
  useEffect(() => {
    if (data.stock <= 3) {
      setShowAlert(true)
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [data.stock])

  // Sound effect for both buttons
  const [playLemonClick] = useSound("/sounds/lemonclick.wav")

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("lemonData")
    if (savedData) {
      setData(JSON.parse(savedData))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lemonData", JSON.stringify(data))
  }, [data])

  // Function to add a lemon to stock
  const addLemon = () => {
    playLemonClick()
    setData((prev) => ({
      ...prev,
      stock: prev.stock + 1,
      purchased: prev.purchased + 1,
    }))
  }

  // Function to consume half a lemon
  const consumeLemon = () => {
    if (data.stock <= 0) return

    playLemonClick()

    const today = format(new Date(), "yyyy-MM-dd")
    const dailyConsumption = { ...data.dailyConsumption }

    // Update today's consumption
    dailyConsumption[today] = (dailyConsumption[today] || 0) + 0.5

    setData((prev) => ({
      ...prev,
      stock: prev.stock - 0.5,
      consumed: prev.consumed + 0.5,
      dailyConsumption,
    }))
  }

  // Format the stock display
  const formatStock = (stock: number) => {
    return stock % 1 === 0 ? stock.toString() : stock.toFixed(1)
  }

  // Get the last 14 days for the contribution calendar
  const getLast14Days = () => {
    const today = new Date()
    const twoWeeksAgo = subDays(today, 13) // 14 days including today

    return eachDayOfInterval({
      start: twoWeeksAgo,
      end: today,
    })
  }

  // Get consumption level for a specific day (0-4)
  const getConsumptionLevel = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const consumption = data.dailyConsumption[dateStr] || 0

    if (consumption === 0) return 0
    if (consumption <= 0.5) return 1
    if (consumption <= 1) return 2
    if (consumption <= 2) return 3
    return 4
  }

  // Get the day name (e.g., "Mon")
  const getDayName = (date: Date) => {
    return format(date, "EEE")
  }

  // Get total consumption for the last 14 days
  const getRecentConsumption = () => {
    const days = getLast14Days()
    return days.reduce((total, day) => {
      const dateStr = format(day, "yyyy-MM-dd")
      return total + (data.dailyConsumption[dateStr] || 0)
    }, 0)
  }

  // Get alert message based on stock
  const getAlertMessage = () => {
    if (data.stock === 0) return "YOU ARE OUT OF LEMONS!"
    return "You're running low on lemons!"
  }

  return (
    <div className="space-y-6">
      {/* Stock Display with Alert */}
      <div className="text-center relative">
        <div className="flex items-center justify-center">
          <motion.div
            className="text-6xl font-bold text-yellow-900 mb-2"
            key={data.stock}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {formatStock(data.stock)}
          </motion.div>

          {/* Alert Message */}
          <AnimatePresence>
            {data.stock <= 3 && showAlert && (
              <motion.div
                className="absolute top-0 right-0 ml-2 text-xs font-bold text-red-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.1, 1],
                  transition: {
                    scale: {
                      repeat: 2,
                      repeatType: "reverse",
                      duration: 0.3,
                    },
                  },
                }}
                exit={{ opacity: 0 }}
              >
                {getAlertMessage()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-xl text-yellow-900">Lemons in Stock</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-8 my-12">
        <motion.button
          onClick={consumeLemon}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className="relative"
          disabled={data.stock <= 0}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/half-lemon-K09q7RxARxIQW5IQSxczkGgk2WaqsK.png"
            alt="Consume half lemon"
            width={120}
            height={120}
            className={data.stock <= 0 ? "opacity-50" : ""}
          />
        </motion.button>

        <motion.button onClick={addLemon} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} className="relative">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/full-lemon-7rdib85UsC8qz9iFuCiqyzAz01DZVa.png"
            alt="Add lemon"
            width={150}
            height={150}
            className="object-contain -mt-3"
          />
        </motion.button>
      </div>

      {/* Stats Toggle Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowStats(!showStats)}
          className="flex items-center gap-1 text-sm text-yellow-900 hover:text-yellow-950 transition-colors"
        >
          {showStats ? (
            <>
              Hide Stats <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show Stats <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* GitHub-style Calendar and Stats */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-4"
          >
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg">
              {/* GitHub-style Contribution Calendar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-medium text-yellow-800">Last 14 Days</h3>
                  <p className="text-xs text-yellow-700">{getRecentConsumption().toFixed(1)} lemons consumed</p>
                </div>

                <div className="contribution-calendar">
                  {getLast14Days().map((day, index) => (
                    <div
                      key={index}
                      className={`contribution-day contribution-level-${getConsumptionLevel(day)}`}
                      title={`${format(day, "MMM d")}: ${data.dailyConsumption[format(day, "yyyy-MM-dd")] || 0} lemons`}
                    />
                  ))}
                </div>

                <div className="flex justify-between text-xs text-yellow-700">
                  <span>{format(getLast14Days()[0], "MMM d")}</span>
                  <span>{format(getLast14Days()[13], "MMM d")}</span>
                </div>
              </div>

              {/* Compact Stats */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-yellow-100/50 p-1.5 rounded text-center">
                  <p className="text-xs text-yellow-800">Total Purchased</p>
                  <p className="text-base font-bold text-yellow-700">{data.purchased}</p>
                </div>
                <div className="bg-yellow-100/50 p-1.5 rounded text-center">
                  <p className="text-xs text-yellow-800">Total Consumed</p>
                  <p className="text-base font-bold text-yellow-700">{data.consumed}</p>
                </div>
              </div>

              <div className="text-xs text-center text-yellow-700 mt-1">
                {data.consumed > 0 ? (
                  <p>
                    Average: {(data.consumed / Math.max(Object.keys(data.dailyConsumption).length, 1)).toFixed(1)}{" "}
                    lemons per day
                  </p>
                ) : (
                  <p>No consumption data yet</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

