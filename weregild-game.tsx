"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  Skull,
  RotateCcw,
  Share,
  BookOpen,
  AlertTriangle,
  Crown,
  Sword,
  Volume2,
  VolumeX,
} from "lucide-react"

type GameState = {
  screen: string
  gender: "man" | "woman" | null
  rank: "ceorl" | "six" | "thegn" | "ealdorman" | null
  location: string
  method: string
  perpetrator: string
  weregild: number
  enslaved: boolean
  locationData: any
  methodData: any
  perpData: any
}

const locations = [
  { text: "a church, during mass", multiplier: 2, flat: 0 },
  { text: "a church, using a chalice", multiplier: 2, flat: 0 },
  { text: "a field", multiplier: 1, flat: 0 },
  { text: "Home invasion", multiplier: 1, flat: 30 },
  { text: "while you were in service to the king", multiplier: 1, flat: 1200 },
  { text: "a public meeting", multiplier: 2, flat: 50 },
  { text: "in a nobleman's home", multiplier: 1, flat: 60 },
  { text: "during a highway robbery", multiplier: 1, flat: 20 },
]

const methods = [
  { text: "killed in an accident", witeMultiplier: 1, flat: 0 },
  { text: "run through with a seax", witeMultiplier: 1, flat: 0 },
  { text: "shot with an arrow", witeMultiplier: 1, flat: 0 },
  { text: "hit by a rock", witeMultiplier: 1, flat: 0 },
  { text: "tortured to death with my hands bound in shackles", witeMultiplier: 1, flat: 120 },
  { text: "killed after being caught stealing from my neighbor", witeMultiplier: 0, flat: -999 },
]

const perpetrators = [
  { text: "a servant or slave", multiplier: 2, flat: 100 },
  { text: "a freeman", multiplier: 1, flat: 0 },
  { text: "your neighbor", multiplier: 1, flat: 0 },
  { text: "a family member", multiplier: 1, flat: 0 },
  { text: "a thegn", multiplier: 1, flat: 0 },
  { text: "a foreigner", multiplier: 1, flat: 0 },
]

const rankValues = {
  ceorl: 20,
  six: 40,
  thegn: 60,
  ealdorman: 120,
}

const slaveryMessages = [
  "Unfortunately, you were found guilty of stealing the parish priest's finest chalice and were enslaved as punishment. No weregild for you!",
  "Sadly, you took too long to pay off a debt and now shovel hay without pay 18 hours a day. Or at least, you did when you were alive. No weregild for you.",
  "Tragically, you were a captured Briton warrior forced into slavery. No weregild for you.",
]

const GOODS = [
  { name: "Chickens (15)", costShillings: 0.08, emoji: "🐔" },
  { name: "Common house dog", costShillings: 0.33, emoji: "🐕" },
  { name: "Hive swarm after August", costShillings: 0.33, emoji: "🐝" },
  { name: "Stranger's/dunghill dog", costShillings: 0.33, emoji: "🐕" },
  { name: "Virgin swarm of bees", costShillings: 1.33, emoji: "🐝" },
  { name: "Unfledged sparrowhawk", costShillings: 1, emoji: "🦅" },
  { name: "Ewe and lamb", costShillings: 1, emoji: "🐑" },
  { name: "Unfledged peregrine falcon", costShillings: 10, emoji: "🦅" },
  { name: "Sparrowhawk nest", costShillings: 2, emoji: "🦅" },
  { name: "Hive of bees", costShillings: 2, emoji: "🐝" },
  { name: "Old swarm of bees", costShillings: 2, emoji: "🐝" },
  { name: "Second swarm of bees", costShillings: 1, emoji: "🐝" },
  { name: "Sparrowhawk (fledged)", costShillings: 2, emoji: "🦅" },
  { name: "Pig", costShillings: 1.67, emoji: "🐖" },
  { name: "Sheep", costShillings: 0.83, emoji: "🐑" },
  { name: "Swarm of bees", costShillings: 1, emoji: "🐝" },
  { name: "Ox", costShillings: 6.71, emoji: "🐄" },
  { name: "Cow", costShillings: 5.38, emoji: "🐄" },
  { name: "Soldier's monthly wage", costShillings: 10, emoji: "⚔️" },
  { name: "Buck hound", costShillings: 10, emoji: "🐕" },
  { name: "Freeman's lap dog", costShillings: 10, emoji: "🐕" },
  { name: "Untrained king's hunting dog", costShillings: 10, emoji: "🐕" },
  { name: "King's hunting dog (1 yr)", costShillings: 5, emoji: "🐕" },
  { name: "King's hunting dog (young)", costShillings: 2.5, emoji: "🐕" },
  { name: "King's hunting pup (eyes closed)", costShillings: 1.25, emoji: "🐕" },
  { name: "Horse", costShillings: 16.13, emoji: "🐎" },
  { name: "Trained king's hunting dog", costShillings: 20, emoji: "🐕" },
  { name: "Lap dog (king's or noble)", costShillings: 20, emoji: "🐕" },
  { name: "Fledged peregrine falcon", costShillings: 20, emoji: "🦅" },
  { name: "Hawk's nest (peregrine)", costShillings: 20, emoji: "🦅" },
  { name: "Sword", costShillings: 240, emoji: "⚔️" },
  { name: "Male slave", costShillings: 16.46, emoji: "🧍‍♂️" },
  { name: "Female slave", costShillings: 10.96, emoji: "🧍‍♀️" },
]

export default function WeregildGame() {
  const [gameState, setGameState] = useState<GameState>({
    screen: "title",
    gender: null,
    rank: null,
    location: "",
    method: "",
    perpetrator: "",
    weregild: 0,
    enslaved: false,
    locationData: null,
    methodData: null,
    perpData: null,
  })

  const [showShareModal, setShowShareModal] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showFootnote, setShowFootnote] = useState<number | null>(null)

  const rollDice = (sides: number) => Math.floor(Math.random() * sides) + 1

  const calculateWeregild = () => {
    if (
      gameState.enslaved ||
      !gameState.rank ||
      !gameState.locationData ||
      !gameState.methodData ||
      !gameState.perpData
    )
      return 0

    const rankManbot = rankValues[gameState.rank]
    const genderMod = 1 // Men and women get same weregild in our implementation

    // Check for no weregild cases
    if (gameState.methodData.flat === -999) return 0

    const locationMult = gameState.locationData.multiplier
    const locationFlat = gameState.locationData.flat
    const methodFlat = gameState.methodData.flat
    const perpFlat = gameState.perpData.flat
    const witeBase = rankManbot / 2
    const witeMult = gameState.methodData.witeMultiplier
    const perpMult = gameState.perpData.multiplier

    const base = rankManbot * genderMod * locationMult
    const additions = locationFlat + methodFlat + perpFlat + witeBase * witeMult
    const final = (base + additions) * perpMult

    return Math.round(final)
  }

  const getWeregildBreakdown = () => {
    if (
      gameState.enslaved ||
      !gameState.rank ||
      !gameState.locationData ||
      !gameState.methodData ||
      !gameState.perpData
    )
      return null

    const rankManbot = rankValues[gameState.rank]
    const genderMod = 1

    if (gameState.methodData.flat === -999) {
      return {
        reason: "No weregild due to criminal circumstances",
        details: [
          {
            label: "Criminal circumstances",
            value: "No compensation",
            description: `You were ${gameState.method} - being caught in the act of theft negates any weregild claim`,
          },
          {
            label: "Legal precedent",
            value: "Anglo-Saxon law",
            description: "Criminals forfeit their right to weregild compensation when killed during illegal acts",
          },
          {
            label: "Final weregild",
            value: "0 shillings",
            description: "No payment due to criminal activity at time of death",
          },
        ],
      }
    }

    const locationMult = gameState.locationData.multiplier
    const locationFlat = gameState.locationData.flat
    const methodFlat = gameState.methodData.flat
    const perpFlat = gameState.perpData.flat
    const witeBase = rankManbot / 2
    const witeMult = gameState.methodData.witeMultiplier
    const perpMult = gameState.perpData.multiplier

    const base = rankManbot * genderMod * locationMult
    const additions = locationFlat + methodFlat + perpFlat + witeBase * witeMult
    const final = (base + additions) * perpMult

    const details = [
      {
        label: "Base calculation",
        value: `${rankManbot} × ${genderMod} × ${locationMult} = ${base}`,
        description: `${gameState.rank} rank × gender × location multiplier`,
      },
      {
        label: "Location bonus",
        value: `+${locationFlat}`,
        description: locationFlat > 0 ? "Special location penalty" : "No location bonus",
      },
      {
        label: "Method bonus",
        value: `+${methodFlat}`,
        description: methodFlat > 0 ? "Aggravated circumstances" : "Standard method",
      },
      {
        label: "Perpetrator bonus",
        value: `+${perpFlat}`,
        description: perpFlat > 0 ? "Lower status killer penalty" : "Standard perpetrator",
      },
      {
        label: "Wite (King's cut)",
        value: `+${witeBase * witeMult}`,
        description: `${witeBase} (half base weregild) × ${witeMult} multiplier`,
      },
      {
        label: "Subtotal",
        value: `${base + additions}`,
        description: "Base + all additions",
      },
      {
        label: "Perpetrator multiplier",
        value: `×${perpMult}`,
        description: perpMult > 1 ? "Enhanced penalty for perpetrator type" : "Standard penalty",
      },
      {
        label: "Final weregild",
        value: `${Math.round(final)}`,
        description: "Final calculated amount",
      },
    ]

    return { details, total: gameState.weregild }
  }

  const getModernValue = (shillings: number) => {
    const shillingToGBP = 100
    const gbpToUSD = 1.3
    const modernGBP = shillings * shillingToGBP
    const modernUSD = modernGBP * gbpToUSD

    return {
      gbp: modernGBP,
      usd: modernUSD,
    }
  }

  const getAffordableGoods = (weregildShillings: number) => {
    return GOODS.filter((item) => item.costShillings <= weregildShillings)
      .sort((a, b) => b.costShillings - a.costShillings)
      .slice(0, 8) // Show top 8 most expensive items they can afford
  }

  const getDeathDescription = () => {
    if (!gameState.method || !gameState.perpetrator || !gameState.location) return ""

    const locationText =
      gameState.location.startsWith("while") || gameState.location.startsWith("during")
        ? gameState.location
        : `in ${gameState.location}`

    return `${gameState.method} by ${gameState.perpetrator} ${locationText}`
  }

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case "ealdorman":
        return <Crown className="w-6 h-6 text-yellow-400" />
      case "thegn":
        return <Sword className="w-6 h-6 text-blue-400" />
      case "six":
        return (
          <div className="w-6 h-6 bg-green-400 flex items-center justify-center text-black text-xs font-bold">6</div>
        )
      case "ceorl":
        return (
          <div className="w-6 h-6 bg-gray-400 flex items-center justify-center text-black text-xs font-bold">C</div>
        )
      default:
        return null
    }
  }

  const generateShareCard = () => {
    const deathDescription = getDeathDescription()
    const modernValue = getModernValue(gameState.weregild)

    return (
      <div className="relative bg-white border-4 sm:border-8 border-black p-4 sm:p-8 max-w-lg mx-auto text-center space-y-4 sm:space-y-6 shadow-2xl">
        {/* Decorative corner elements */}
        <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-black"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-black"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-black"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-black"></div>

        {/* Header */}
        <div className="space-y-2 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-black"></div>
          <h1 className="text-2xl sm:text-3xl font-bold font-prince-valiant text-black tracking-wide">
            MY ANGLO-SAXON
          </h1>
          <h2 className="text-3xl sm:text-4xl font-bold font-prince-valiant text-red-600 -mt-2">WEREGILD</h2>
          <div className="text-xs text-black font-medium tracking-widest uppercase">Anno Domini 900-1100</div>
        </div>

        {/* Main weregild display */}
        <div className="relative bg-black text-white p-6 shadow-inner">
          <div className="pt-2">
            <div className="text-3xl sm:text-5xl font-bold font-prince-valiant mb-2 text-yellow-400">
              {gameState.weregild === 0 ? "NO WEREGILD" : `${gameState.weregild}`}
            </div>
            {gameState.weregild > 0 && (
              <>
                <div className="text-xl font-prince-valiant text-yellow-300 mb-2">SHILLINGS</div>
                <div className="text-sm text-white border-t border-gray-300 pt-2">
                  Modern Value: <span className="font-bold">${modernValue.usd.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Character details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 border-2 border-black shadow-md">
            <div className="flex items-center justify-center mb-2">{gameState.gender === "man" ? "👨" : "👩"}</div>
            <div className="text-xs font-bold text-black uppercase tracking-wide">Gender</div>
            <div className="text-lg font-prince-valiant text-blue-600 capitalize">{gameState.gender}</div>
          </div>
          <div className="bg-gray-100 p-4 border-2 border-black shadow-md">
            <div className="flex items-center justify-center mb-2">{getRankIcon(gameState.rank || "")}</div>
            <div className="text-xs font-bold text-black uppercase tracking-wide">Rank</div>
            <div className="text-lg font-prince-valiant text-blue-600 capitalize">
              {gameState.rank === "six" ? "Six-hynde" : gameState.rank}
            </div>
          </div>
        </div>

        {/* Death description */}
        <div className="bg-gray-100 border-2 border-black p-4">
          <div className="flex items-center justify-center mb-2">
            <Skull className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-xs font-bold text-black uppercase tracking-wide mb-2">Manner of Death</div>
          <div className="text-sm text-black font-medium leading-tight">I was {deathDescription}</div>
        </div>

        {/* Purchasing power */}
        {gameState.weregild > 0 &&
          (() => {
            const affordableGoods = getAffordableGoods(gameState.weregild)
            const topItems = affordableGoods.slice(0, 6) // Increased to 6 items

            return (
              <div className="bg-gray-100 border-2 border-black p-3 sm:p-4">
                <div className="text-xs font-bold text-black uppercase tracking-wide mb-3">This Could Buy Me...</div>
                <div className="flex flex-wrap gap-1 sm:gap-2 text-xs">
                  {topItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-white border border-black px-2 py-1 rounded-sm min-w-0 flex-shrink-0"
                    >
                      <span className="mr-1 text-sm">{item.emoji}</span>
                      <span className="text-green-600 font-medium truncate text-xs sm:text-sm">
                        {item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

        {/* Footer */}
        <div className="border-t-2 border-black pt-4 space-y-2">
          <div className="text-xs text-black font-bold tracking-widest">OCATHAL 2025</div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1 w-2 h-16 bg-black transform -translate-y-1/2 opacity-30"></div>
        <div className="absolute top-1/2 right-1 w-2 h-16 bg-black transform -translate-y-1/2 opacity-30"></div>
      </div>
    )
  }

  const playSound = (soundPath: string) => {
    if (isMuted) return

    try {
      const audio = new Audio(soundPath)
      audio.volume = 0.5 // Set volume to 50%
      audio.play().catch((error) => {
        console.log("Audio play failed:", error)
      })
    } catch (error) {
      console.log("Audio creation failed:", error)
    }
  }

  const playRandomDiceSound = () => {
    if (isMuted) return

    const diceRoll = Math.floor(Math.random() * 3) + 1
    playSound(`/sounds/dice${diceRoll}.mp3`)
  }

  const nextScreen = (screen: string, updates: Partial<GameState> = {}) => {
    setGameState((prev) => ({ ...prev, screen, ...updates }))
  }

  const rollGender = () => {
    playRandomDiceSound()
    const result = rollDice(2)
    const gender = result === 1 ? "man" : "woman"
    nextScreen(gender === "woman" ? "2.1" : "2.2", { gender })
  }

  const rollSlavery = () => {
    playRandomDiceSound()
    const result = rollDice(10)
    if (result === 1) {
      nextScreen("enslaved", { enslaved: true })
    } else {
      nextScreen("3.1", { enslaved: false })
    }
  }

  const rollRank = () => {
    playRandomDiceSound()
    const result = rollDice(4)
    let rank: "ceorl" | "six" | "thegn" | "ealdorman"

    if (result === 1) rank = "ceorl"
    else if (result === 2) rank = "six"
    else if (result === 3) rank = "thegn"
    else rank = "ealdorman"

    nextScreen("5.1", { rank })
  }

  const rollDeath = () => {
    playRandomDiceSound()
    const locationRoll = rollDice(8) - 1
    const methodRoll = rollDice(6) - 1
    const perpRoll = rollDice(6) - 1

    const locationData = locations[locationRoll]
    const methodData = methods[methodRoll]
    const perpData = perpetrators[perpRoll]

    nextScreen("6.1", {
      location: locationData.text,
      method: methodData.text,
      perpetrator: perpData.text,
      locationData,
      methodData,
      perpData,
    })
  }

  const finishGame = () => {
    playSound("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coin-9cDLv6BbgvsFq1g4VoW2yCseiHuKeS.mp3")
    const weregild = calculateWeregild()
    nextScreen("7.1", { weregild })
  }

  const resetGame = () => {
    setGameState({
      screen: "title",
      gender: null,
      rank: null,
      location: "",
      method: "",
      perpetrator: "",
      weregild: 0,
      enslaved: false,
      locationData: null,
      methodData: null,
      perpData: null,
    })
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const FootnotePopup = ({
    footnoteNumber,
    citation,
    onClose,
  }: { footnoteNumber: number; citation: string; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-black p-6 max-w-lg w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-black font-prince-valiant">Footnote {footnoteNumber}</h3>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="bg-transparent hover:bg-transparent border-none text-black text-xl"
          >
            ✕
          </Button>
        </div>
        <p className="text-black text-sm leading-relaxed">{citation}</p>
      </div>
    </div>
  )

  const renderScreen = () => {
    switch (gameState.screen) {
      case "title":
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold high-contrast-text mb-4 font-prince-valiant float-animation">
                Calculate Your Weregild!
              </h1>
              <p className="text-xl high-contrast-text font-helvetica">
                How much would your life be worth in early medieval England?
              </p>
            </div>

            <div className="flex justify-center">
              <img src="/were.gif" alt="Medieval executioner animation" className="w-96 h-auto" />
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <Button
                  size="lg"
                  className="custom-start-button px-8 text-2xl text-white bg-transparent hover:bg-transparent"
                  onClick={() => {
                    playSound("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sword-5YnEt1c6g6tsQNmhZ4fvdzoMS4usHW.mp3")
                    nextScreen("1")
                  }}
                >
                  Start
                </Button>
              </div>
              <br></br>
              <br></br>
              <Button
                onClick={() => nextScreen("sources")}
                variant="outline"
                size="sm"
                className="square-button bg-transparent"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Sources
              </Button>
              <Button
                onClick={() => nextScreen("disclaimer")}
                variant="outline"
                size="sm"
                className="square-button bg-transparent"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Disclaimer
              </Button>
              <br></br>
            </div>

            <p className="text-xs high-contrast-text font-helvetica">Copyright © Ó Cathail MMXXV</p>
          </div>
        )

      case "disclaimer":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-5xl font-bold text-center high-contrast-text font-prince-valiant">Disclaimer</h2>
            <div className="text-base leading-relaxed space-y-4 font-helvetica">
              <p className="high-contrast-text">
                <span className="illuminated-letter">D</span>
                ear historians, forgive me, this is a game. I know historically, the calculation of weregild would have
                been additive, contextual, categorical, and overall not quite so algorithmic. That being said, I take
                pride in my research (what little I can rustle up without a university login) so please do email me if
                there's anything in here that stands out to you as false, anachronistic or just plain rude.
              </p>
            </div>
            <div className="text-center">
              <Button onClick={() => nextScreen("title")} className="btn-action bg-transparent hover:bg-transparent">
                Return to Main Menu
              </Button>
            </div>
          </div>
        )

      case "sources":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-5xl font-bold text-center high-contrast-text font-prince-valiant">Ancient Sources</h2>
            <div className="text-sm high-contrast-text space-y-2 font-helvetica">
              <ul className="space-y-2">
                <li>
                  Ernest F. Henderson, Select Historical Documents of the Middle Ages (London: George Bell and Sons,
                  1896).
                </li>
                <li>
                  Richard Fletcher, Bloodfeud: Murder and Revenge in Anglo-Saxon England (London: Allen Lane, 2002).
                </li>
                <li>
                  D. R. Wilton, "Fæhða Gemyndig: Hostile Acts Versus Enmity," Neophilologus 99 (2015): 647–666.
                  https://doi.org/10.1007/s11061-015-9434-8.
                </li>
                <li>
                  Kelse Bright Merrill, "Gecnawan Thou Geweorth – To Know Your Worth: Examining Variations of Wergild in
                  Anglo-Saxon England: 600 C.E.–850 C.E." (MA thesis, 2019).
                </li>
                <li>
                  F. L. Attenborough, ed. and trans., The Laws of the Earliest English Kings (Cambridge: Cambridge
                  University Press, 1922), Laws of Ine and Laws of Alfred.
                </li>
                <li>Ibid.</li>
                <li>
                  Oliver J. Thatcher, ed., The Library of Original Sources, vol. 4, The Early Medieval World (Milwaukee:
                  University Research Extension Co., 1901), 211–239.
                </li>
                <li>
                  Lisi Oliver, The Beginnings of English Law (Toronto: University of Toronto Press, 2002), Toronto
                  Medieval Texts and Translations 14.
                </li>
                <li>
                  Charles Donahue Jr., "Materials on English Legal History: Early Medieval English Law (selections),"
                  Harvard Law School.
                  http://www.law.harvard.edu/faculty/cdonahue/courses/lhsemelh/materials/Mats2D_2F.pdf.
                </li>
                <li>
                  "Waltheof, Earl of Northumbria (d. 1076)," Oxford Dictionary of National Biography, accessed July 31,
                  2025.
                  https://www.oxforddnb.com/display/10.1093/ref:odnb/9780198614128.001.0001/odnb-9780198614128-e-27981.
                </li>
                <li>The Chronicle of John of Worcester, various manuscripts and editions.</li>
                <li>The Anglo-Saxon Chronicle, various manuscripts and editions.</li>
              </ul>
            </div>
            <div className="text-center">
              <Button onClick={() => nextScreen("title")} className="btn-action bg-transparent hover:bg-transparent">
                Return to Main Menu
              </Button>
            </div>
          </div>
        )

      case "1":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-5xl font-bold text-center high-contrast-text font-prince-valiant">Kyrie eleison!</h2>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              <p>
                <span className="illuminated-letter">T</span>
                he bad news is, you've been murdered. Axed. Chopped. Dead as a doornail. The good news is, you lived in
                an Anglo Saxon Kingdom between the 9th and 11th centuries, which means the fellow responsible for your
                demise now owes your family a weregild, or man-price. If you've lived a life of note, it may even be a
                decent sum!
              </p>

              <p>
                This practice was first codified in Frankish law (better known as Lex Salica) by Clovis around 500AD,
                and continued until around the 12th century{" "}
                <button
                  onClick={() => setShowFootnote(1)}
                  className="text-red-500 font-bold hover:text-red-400 text-xs align-super"
                >
                  1
                </button>
                . Echoes of the weregild exist today in the form of payable legal damages.
              </p>

              <p>
                The payment of weregild was the medieval king's way of preventing endless cycles of blood feuds, or fæhð
                <button
                  onClick={() => setShowFootnote(3)}
                  className="text-red-500 font-bold hover:text-red-400 text-xs align-super"
                >
                  3
                </button>
                . In times where a single assassination could lead to four generations of back-and-forth son murdering,
                being able to settle grudges with money made life a bit simpler.
              </p>

              <Collapsible>
                <CollapsibleTrigger className="collapsible-trigger flex items-center gap-2 text-red-500">
                  <ChevronDown className="w-4 h-4" />
                  More about blood feuds
                </CollapsibleTrigger>
                <CollapsibleContent className="collapsible-content mt-2 p-4 text-sm">
                  An ealdorman of Northumbria named Uhtred was murdered after riding to meet the invading Danish King
                  Cnut under the pretense of a diplomatic meeting in 1016. His assassin, a Dane named Thurbrand the
                  Hold, was killed by Uhtred's son Ealdred around eight years later. Thurbrand's son Carl killed Ealdred
                  at a feast in 1038, and in 1072, Ealdred's grandson Waltheof slayed all of Carl's sons and grandsons
                  (save one lucky fellow named Cnut) during another feast near York. Waltheof was later executed by
                  William the Conqueror, and with most of each family now dead, the feud was over{" "}
                  <button
                    onClick={() => setShowFootnote(2)}
                    className="text-red-500 font-bold hover:text-red-400 text-xs align-super"
                  >
                    2
                  </button>
                  .
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="text-center">
              <Button onClick={() => nextScreen("2")} className="prince-valiant-button px-3 text-2xl">
                Discover Thy Worth!
              </Button>
            </div>
          </div>
        )

      case "2":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-5xl font-bold text-center high-contrast-text font-prince-valiant">
              It's a Man's World…
            </h2>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              <p>
                <span className="illuminated-letter">T</span>
                he Anglo Saxons were very much into the gender binary. Boo! Men and women had distinct roles in society,
                and the weregild of a slain person would take their gender into account
                <button
                  onClick={() => setShowFootnote(4)}
                  className="text-red-500 font-bold hover:text-red-400 text-xs align-super"
                >
                  4
                </button>
                .
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="text-center">
                <Button
                  onClick={() => nextScreen("2.2", { gender: "man" })}
                  variant="outline"
                  className="medieval-button px-6 text-2xl"
                >
                  I am a man
                </Button>
              </div>
              <div className="text-center">
                <Button
                  onClick={() => nextScreen("2.1", { gender: "woman" })}
                  variant="outline"
                  className="medieval-button px-6 text-2xl"
                >
                  I am a woman
                </Button>
              </div>
              <div className="text-center">
                <Button onClick={rollGender} className="square-button bg-transparent px-6 text-2xl">
                  Let the Fates Decide
                </Button>
              </div>
            </div>
          </div>
        )

      case "2.1":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-4xl font-bold text-center high-contrast-text font-prince-valiant">A Woman's Worth</h2>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              <p>
                <span className="illuminated-letter">B</span>
                elieve it or not, you're entitled to the same weregild as a man. In legal terms, this period wasn't
                actually the absolute worst for women. If you were pregnant, you'd also get half the child's father's
                weregild as well.
              </p>

              <Collapsible>
                <CollapsibleTrigger className="collapsible-trigger flex items-center gap-2 text-red-500">
                  <ChevronDown className="w-4 h-4" />
                  More about women's rights
                </CollapsibleTrigger>
                <CollapsibleContent className="collapsible-content mt-2 p-4 text-sm">
                  Very little, if any, primary sources that report weregilds for slain women exist. We can however, see
                  a few examples of recompense for non-fatal damages in King Alfred's Law Code. He passed laws that
                  forbade women (at least legally) from being forcibly married, sold for money, kidnapped and/or
                  assaulted. You could also own your own property, land, and….slaves.
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="text-center">
              <Button onClick={() => nextScreen("3")} className="prince-valiant-button px-6 text-2xl">
                Continue
              </Button>
            </div>
          </div>
        )

      case "2.2":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-4xl font-bold text-center high-contrast-text font-prince-valiant">A Man's World</h2>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              <p>
                <span className="illuminated-letter">L</span>
                ucky you. Anglo-Saxon England was a man's world, and unless you were a slave, you're off to a good
                start.
              </p>
            </div>

            <div className="text-center">
              <Button onClick={() => nextScreen("3")} className="prince-valiant-button px-6 text-2xl">
                Continue Thy Journey
              </Button>
            </div>
          </div>
        )

      case "3":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-5xl font-bold text-center high-contrast-text font-prince-valiant">
              Speaking of servitude…
            </h2>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              <p>
                <span className="illuminated-letter">R</span>
                oughly (very roughly, and according to the Domesday Book of 1086) 10% of the Anglo Saxon population of
                England were enslaved
                <button
                  onClick={() => setShowFootnote(5)}
                  className="text-red-500 font-bold hover:text-red-400 text-xs align-super"
                >
                  5
                </button>
                . Enslaved people were not eligible to receive a weregild. Click the button below to see if fate has at
                least spared you this suffering.
              </p>

              <Collapsible>
                <CollapsibleTrigger className="collapsible-trigger flex items-center gap-2 text-red-500">
                  <ChevronDown className="w-4 h-4" />
                  More about slavery
                </CollapsibleTrigger>
                <CollapsibleContent className="collapsible-content mt-2 p-4 text-sm">
                  Most people in this position were enslaved as a punishment for a crime. However, members of the
                  conquered indigenous Briton tribes were also forced into servitude
                  <button
                    onClick={() => setShowFootnote(6)}
                    className="text-red-500 font-bold hover:text-red-400 text-xs align-super"
                  >
                    6
                  </button>
                  .
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="text-center">
              <Button onClick={rollSlavery} className="prince-valiant-button px-6 text-2xl">
                Cast the Bones of Fate
              </Button>
            </div>
          </div>
        )

      case "3.1":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-4xl font-bold text-center high-contrast-text font-prince-valiant">Freedom!</h2>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              <p>Congratulations! You are a free member of society. You're still dead though. Don't forget that.</p>
            </div>

            <div className="text-center">
              <Button onClick={() => nextScreen("4")} className="prince-valiant-button px-6 text-2xl">
                Proceed as Freeman
              </Button>
            </div>
          </div>
        )

      case "enslaved":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-4xl font-bold text-center red-accent font-prince-valiant">Enslaved</h2>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              <p>
                <span className="illuminated-letter">A</span>
                {slaveryMessages[Math.floor(Math.random() * slaveryMessages.length)].substring(1)}
              </p>
            </div>

            <div className="text-center">
              <Button onClick={resetGame} className="btn-action bg-transparent hover:bg-transparent">
                Begin Anew
              </Button>
            </div>
          </div>
        )

      case "4":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-5xl font-bold text-center high-contrast-text font-prince-valiant">
              The Three Components
            </h2>

            <div className="flex justify-center">
              <img src="/coin.gif" alt="Medieval coin exchange animation" className="w-64 h-auto" />
            </div>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              <p>
                <span className="illuminated-letter">N</span>
                ow things start to get a bit tricky. To keep things straight, we'll go off King Alfred's three
                components of manwyrþ, or manworth, that affected weregild calculations
                <button
                  onClick={() => setShowFootnote(7)}
                  className="text-red-500 font-bold hover:text-red-400 text-xs align-super"
                >
                  7
                </button>
                .
              </p>

              <div className="space-y-3">
                <div>
                  <strong className="high-contrast-text">Weregild:</strong> You know this one. If you're a rich fella,
                  you cost more to kill. You may be familiar with the use of were in the term werewolf, meaning wolf
                  man.
                </div>

                <div>
                  <strong className="high-contrast-text">Wite:</strong> The king's cut of your weregild. Could get
                  especially pricey if you were murdered on his magnificence's business or a special feast day.
                  Typically about half of your weregild.
                  <Collapsible>
                    <CollapsibleTrigger className="collapsible-trigger flex items-center gap-2 mt-2 text-red-500">
                      <ChevronDown className="w-4 h-4 text-red-500" />
                      More about Wite
                    </CollapsibleTrigger>
                    <CollapsibleContent className="collapsible-content mt-2 p-4 text-sm">
                      The Wite was a reminder that this practice was the King's initiative to prevent bloodshed. You
                      weren't just paying off your nasty neighbor's wife, you were promising the King (on pain of death)
                      that you would behave yourself.
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                <div>
                  <strong className="high-contrast-text">Bot:</strong> This one only counts if the crime wasn't fatal,
                  which isn't the case for you. But this is a learning experience! Alfred itemized bot payments
                  extremely meticulously, even dividing them into subcategories like emotional offense, breaching
                  hospitality, and hairpulling
                  <button
                    onClick={() => setShowFootnote(8)}
                    className="text-red-500 font-bold hover:text-red-400 text-xs align-super"
                  >
                    8
                  </button>
                  .
                  <Collapsible>
                    <CollapsibleTrigger className="collapsible-trigger flex items-center gap-2 mt-2 text-red-500">
                      <ChevronDown className="w-4 h-4 text-red-500" />
                      Bot examples
                    </CollapsibleTrigger>
                    <CollapsibleContent className="collapsible-content mt-2 p-4 text-sm">
                      Here's the price of a few nonfatal criminal acts: punched in the nose? Three shillings. Shot
                      through your private parts? Six shillings (unless they didn't work anymore, then you get triple
                      your worth). Being stabbed through the thigh earned you 6 shillings, and losing a whole foot or
                      eyeball cost a whopping 50 shillings. More visible wounds made more higher payouts.
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={() => nextScreen("5")} className="prince-valiant-button px-6 text-2xl">
                Continue your journey...
              </Button>
            </div>
          </div>
        )

      case "5":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-5xl font-bold text-center high-contrast-text font-prince-valiant">
              What kind of Saxon are you?
            </h2>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              <p>
                The most important component of your weregild's calculation was your rank in life. Let's look at your
                options:
              </p>
              <br></br>
              <div className="space-y-4">
                <div className="p-4 medieval-border">
                  <strong className="high-contrast-text">Ceorl (20 shillings):</strong> This was the lowest rank of free
                  men. You weren't rich, but you weren't enslaved. The ceorl was the backbone of feudal society,
                  providing agricultural wealth to thegns that owned land.
                </div>

                <div className="p-4 medieval-border">
                  <strong className="high-contrast-text">Six-hynde man (40 shillings):</strong> This was a fellow with a
                  little wealth, most likely working as a retainer for a noble or manager of farmlands worked by ceorls.
                  This social rank would also be (within his capabilities) called up to serve in a fyrd, or militia,
                  when summoned by his lord or king.
                  <Collapsible>
                    <CollapsibleTrigger className="collapsible-trigger flex items-center gap-2 mt-2 text-red-500">
                      <ChevronDown className="w-4 h-4 text-red-500" />
                      More about six-hynde men
                    </CollapsibleTrigger>
                    <CollapsibleContent className="collapsible-content mt-2 p-4 text-sm ">
                      If he prospered and managed to get five hides of land, a church, a kitchen, a gate and a
                      bell-house, he could move up to thegn. Additionally, this is a quasi-class mostly present in
                      Æthelberht's Kentish law codes, but stands in this experience for a roughly upper middle class
                      Saxon.
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                <div className="p-4 medieval-border">
                  <strong className="high-contrast-text">Thegn (Twelve hynde man) (60 shillings):</strong> This class
                  was noble, held lands, and controlled various governmental and commercial efforts. His oath was worth
                  more than the common rabble, and the killing of a thegn came with a hefty pricetag.
                </div>

                <div className="p-4 medieval-border">
                  <strong className="high-contrast-text">Ealdormen (120 shillings):</strong> This was the rung below
                  royalty, and the real muscle in charge of most military goings-on across Anglo Saxon England. The
                  historical record lacks a hard number for an ealdorman's weregild which – in this author's opinion–
                  implies that the price was likely written in blood.
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={rollRank} className="prince-valiant-button px-6 text-2xl">
                Discover Thy Station
              </Button>
            </div>
          </div>
        )

      case "5.1":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-4xl font-bold text-center high-contrast-text font-prince-valiant">Your Social Rank</h2>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              {gameState.rank === "ceorl" && (
                <p>
                  You were a ceorl. You had a decent life of shoveling hay and sleeping in a lovely little thatched roof
                  cottage. When the harvest was good, so was your life. Until you were, of course, murdered.
                </p>
              )}
              {gameState.rank === "six" && (
                <p>
                  You were a six-hynde man. Richer than a peasant but without the glittering towers and robes of a
                  thegn. Not too shabby!
                </p>
              )}
              {gameState.rank === "thegn" && (
                <p>
                  You were a thegn. However you died, you did so well-dressed, well-fed, and probably in league with
                  several power-wielding churches within your holdings.
                </p>
              )}
              {gameState.rank === "ealdorman" && (
                <p>
                  <span className="illuminated-letter">Y</span>
                  ou were an ealdorman. You lived a life of power, influence, and considerable wealth. Your death would
                  have sent shockwaves through the kingdom.
                </p>
              )}
            </div>

            <div className="text-center">
              <Button onClick={() => nextScreen("6")} className="prince-valiant-button px-6 text-2xl">
                Continue to Thy Doom
              </Button>
            </div>
          </div>
        )

      case "6":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-5xl font-bold text-center high-contrast-text font-prince-valiant">How did you die?</h2>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              <p>
                <span className="illuminated-letter">Y</span>
                ou know what they say, there are a million ways to die in Wessex. And in Anglo-Saxon law, how you died
                mattered almost as much as who you were. Get knifed in a public court or sacred space, and your killer
                could owe double or more. Get killed while stealing a neighbor's sheep, and your kin might get nothing
                at all. The law codes treated sacred ground, royal service, and noble houses as high-stakes zones of
                protection, and they punished violations accordingly. Likewise, being murdered by a servant, a
                foreigner, or someone lower in social rank could increase the payout.
              </p>
              <p>Roll the proverbial dice to see how you croaked!</p>
            </div>

            <div className="text-center">
              <Button onClick={rollDeath} className="prince-valiant-button px-6 text-2xl">
                Cast the Dice of Death
              </Button>
            </div>
          </div>
        )

      case "6.1":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-4xl font-bold text-center high-contrast-text font-prince-valiant">Your Grisly End</h2>

            <div className="flex justify-center">
              <img src="/were.gif" alt="Medieval executioner animation" className="w-64 h-auto" />
            </div>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              <p className="text-center text-lg">
                Well, it turns out you were <strong className="red-accent">{gameState.method}</strong> by{" "}
                <strong className="high-contrast-text">{gameState.perpetrator}</strong>{" "}
                {gameState.location.startsWith("while") || gameState.location.startsWith("during")
                  ? gameState.location
                  : `in ${gameState.location}`}
                .
              </p>
            </div>

            <div className="text-center">
              <Button onClick={() => nextScreen("7")} className="prince-valiant-button px-6 text-2xl">
                Proceed to Judgment
              </Button>
            </div>
          </div>
        )

      case "7":
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-5xl font-bold text-center high-contrast-text font-prince-valiant">
              Time to crunch these numbers!
            </h2>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              <p>
                <span className="illuminated-letter">N</span>
                ow we know who you were and how you died. Ready to see what your weregild would be?
              </p>
            </div>

            <div className="text-center">
              <Button onClick={finishGame} className="prince-valiant-button px-6 text-2xl">
                Render Final Judgment
              </Button>
            </div>
          </div>
        )

      case "7.1":
        const breakdown = getWeregildBreakdown()
        const deathDescription = getDeathDescription()
        return (
          <div className="space-y-6 parchment-bg p-6">
            <h2 className="text-5xl font-bold text-center high-contrast-text font-prince-valiant">The Royal Verdict</h2>

            <div className="mb-4">
              <img src="/penny.gif" alt="Medieval penny animation" className="w-32 h-32 mx-auto" />
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold mb-4 high-contrast-text font-prince-valiant">
                {gameState.weregild === 0 ? "No Weregild" : `${gameState.weregild} Shillings`}
              </div>
            </div>

            <div className="space-y-4 text-base leading-relaxed high-contrast-text font-helvetica">
              <p>
                <span className="illuminated-letter">Y</span>
                {gameState.weregild === 0
                  ? `ou were ${deathDescription}. Unfortunately, due to the circumstances of your death, your family receives no compensation. Such is the harsh reality of Anglo-Saxon justice.`
                  : `ou were ${deathDescription}. The court has spoken. Your kin will receive ${gameState.weregild} shillings in exchange for your very dead body.`}
              </p>

              {breakdown && breakdown.details && (
                <Collapsible>
                  <CollapsibleTrigger className="collapsible-trigger flex items-center gap-2 w-full justify-center">
                    <ChevronDown className="w-4 h-4" />
                    <span className="text-lg font-bold font-prince-valiant text-red-500">
                      Reveal the Sacred Calculations
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="p-4 medieval-border">
                      <div className="space-y-3 text-sm">
                        {breakdown.details.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center border-b border-white pb-2 last:border-b-0"
                          >
                            <span className="high-contrast-text font-medium">{item.label}:</span>
                            <div className="text-right">
                              <span className="high-contrast-text font-mono text-base">{item.value}</span>
                              <div className="text-xs high-contrast-text mt-1">{item.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {gameState.weregild > 0 && (
                <div className="mt-6 p-4 medieval-border">
                  <h3 className="text-xl font-bold text-center high-contrast-text font-prince-valiant mb-4">
                    What Thy Weregild Could Buy
                  </h3>

                  {(() => {
                    const modernValue = getModernValue(gameState.weregild)
                    const affordableGoods = getAffordableGoods(gameState.weregild)

                    // Create a shopping basket that uses up the weregild once
                    const createShoppingBasket = (totalShillings: number, availableGoods: typeof affordableGoods) => {
                      const basket = []
                      let remainingShillings = totalShillings

                      // Sort by cost descending to get the most valuable items first
                      const sortedGoods = [...availableGoods].sort((a, b) => b.costShillings - a.costShillings)

                      for (const item of sortedGoods) {
                        if (remainingShillings >= item.costShillings) {
                          const quantity = Math.floor(remainingShillings / item.costShillings)
                          if (quantity > 0) {
                            basket.push({
                              ...item,
                              quantity,
                              totalCost: quantity * item.costShillings,
                            })
                            remainingShillings -= quantity * item.costShillings
                          }
                        }
                      }

                      return { basket, leftover: remainingShillings }
                    }

                    const { basket, leftover } = createShoppingBasket(gameState.weregild, affordableGoods)

                    return (
                      <div className="space-y-4">
                        <div className="text-center high-contrast-text">
                          <p className="text-lg">
                            💀 You were worth: <strong>{gameState.weregild} shillings</strong>
                          </p>
                          <p className="text-sm">
                            💷 £{modernValue.gbp.toLocaleString()} GBP ≈ ${modernValue.usd.toLocaleString()} USD
                          </p>
                        </div>

                        {basket.length > 0 && (
                          <div>
                            <p className="high-contrast-text font-medium mb-2">
                              With your weregild, your family could buy:
                            </p>
                            <div className="grid grid-cols-1 gap-1 text-sm high-contrast-text">
                              {basket.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                  <span>
                                    {item.emoji} {item.quantity > 1 ? `${item.quantity} ${item.name}` : item.name}
                                  </span>
                                  <span className="high-contrast-text">{item.totalCost.toFixed(2)}s</span>
                                </div>
                              ))}
                              {leftover > 0 && (
                                <div className="flex justify-between items-center high-contrast-text border-t border-white pt-1 mt-2">
                                  <span>💰 Leftover coins</span>
                                  <span>{leftover.toFixed(2)}s</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}

              <p className="text-sm high-contrast-text">
                Note: This is an estimated conversion based on surviving Anglo-Saxon legal codes (mainly those of Alfred
                and Æthelberht). Actual compensation may vary depending on how pissed your family is.
              </p>

              <p className="text-center italic font-antoine-dropcaps high-contrast-text text-5xl">
                Sic transit gloria hominis
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetGame} variant="outline" className="square-button bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2 text-2xl" />
                Replay
              </Button>
              <Button
                onClick={() => setShowShareModal(true)}
                variant="outline"
                className="square-button bg-transparent"
              >
                <Share className="w-4 h-4 mr-2 text-2xl" />
                Share Results
              </Button>
            </div>
          </div>
        )

      default:
        return <div>Screen not found</div>
    }
  }

  const ShareModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-black border-4 border-white p-2 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white font-prince-valiant">Share Your Results</h3>
          <Button
            onClick={() => setShowShareModal(false)}
            variant="outline"
            size="sm"
            className="bg-transparent hover:bg-transparent border-none text-white"
          >
            ✕
          </Button>
        </div>

        <div className="space-y-4">
          <div id="share-card" className="bg-white p-1">
            {generateShareCard()}
          </div>

          <div className="flex gap-4 justify-center mt-6">
            <Button
              onClick={() => {
                const text =
                  gameState.weregild === 0
                    ? `I calculated my Anglo-Saxon weregild and got nothing! I was ${getDeathDescription()}. Calculate yours at weregild-calculator.com`
                    : `My Anglo-Saxon weregild would be ${gameState.weregild} shillings (≈$${getModernValue(gameState.weregild).usd.toLocaleString()})! I was ${getDeathDescription()}. Calculate yours at weregild-calculator.com`

                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
                window.open(twitterUrl, "_blank")
              }}
              className="btn-action bg-transparent hover:bg-transparent"
            >
              Share on Twitter
            </Button>

            <Button
              onClick={async () => {
                try {
                  const text =
                    gameState.weregild === 0
                      ? `I calculated my Anglo-Saxon weregild and got nothing! I was ${getDeathDescription()}. Calculate yours at weregild-calculator.com`
                      : `My Anglo-Saxon weregild would be ${gameState.weregild} shillings (≈$${getModernValue(gameState.weregild).usd.toLocaleString()})! I was ${getDeathDescription()}. Calculate yours at weregild-calculator.com`

                  await navigator.clipboard.writeText(text)
                  alert("Copied to clipboard!")
                } catch (err) {
                  console.error("Failed to copy: ", err)
                }
              }}
              variant="outline"
              className="btn-action bg-transparent hover:bg-transparent"
            >
              Copy Text
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {gameState.screen === "title" ? (
          <div className="max-w-2xl mx-auto">{renderScreen()}</div>
        ) : (
          <Card className="max-w-2xl mx-auto medieval-card text-white">
            <CardContent className="p-2">{renderScreen()}</CardContent>
          </Card>
        )}
      </div>
      {showShareModal && <ShareModal />}

      {/* Universal Mute/Unmute Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={toggleMute}
          variant="outline"
          size="sm"
          className="bg-black border-white text-white hover:bg-gray-800 p-2"
          title={isMuted ? "Unmute sounds" : "Mute sounds"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </div>
      {showFootnote === 1 && (
        <FootnotePopup
          footnoteNumber={1}
          citation="Henderson, Ernest F. Select Historical Documents of the Middle Ages London : George Bell and Sons, 1896."
          onClose={() => setShowFootnote(null)}
        />
      )}
      {showFootnote === 2 && (
        <FootnotePopup
          footnoteNumber={2}
          citation="Fletcher, Richard. Bloodfeud: Murder and Revenge in Anglo-Saxon England. Allen Lane 2002."
          onClose={() => setShowFootnote(null)}
        />
      )}
      {showFootnote === 3 && (
        <FootnotePopup
          footnoteNumber={3}
          citation="D. R. Wilton, &quot;Fæhða Gemyndig: Hostile Acts Versus Enmity,&quot; Neophilologus 99 (2015): 647–666. https://doi.org/10.1007/s11061-015-9434-8."
          onClose={() => setShowFootnote(null)}
        />
      )}
      {showFootnote === 4 && (
        <FootnotePopup
          footnoteNumber={4}
          citation="Kelse Bright Merrill, &quot;Gecnawan Thou Geweorth – To Know Your Worth: Examining Variations of Wergild in Anglo-Saxon England: 600 C.E.–850 C.E.&quot; (MA thesis, 2019)."
          onClose={() => setShowFootnote(null)}
        />
      )}
      {showFootnote === 5 && (
        <FootnotePopup
          footnoteNumber={5}
          citation="F. L. Attenborough, ed. and trans., The Laws of the Earliest English Kings (Cambridge: Cambridge University Press, 1922), Laws of Ine and Laws of Alfred."
          onClose={() => setShowFootnote(null)}
        />
      )}
      {showFootnote === 6 && (
        <FootnotePopup
          footnoteNumber={6}
          citation="F. L. Attenborough, ed. and trans., The Laws of the Earliest English Kings (Cambridge: Cambridge University Press, 1922), Laws of Ine and Laws of Alfred."
          onClose={() => setShowFootnote(null)}
        />
      )}
      {showFootnote === 7 && (
        <FootnotePopup
          footnoteNumber={7}
          citation="Oliver J. Thatcher, ed., The Library of Original Sources, vol. 4, The Early Medieval World (Milwaukee: University Research Extension Co., 1901), 211–239."
          onClose={() => setShowFootnote(null)}
        />
      )}
      {showFootnote === 8 && (
        <FootnotePopup
          footnoteNumber={8}
          citation="Oliver J. Thatcher, ed., The Library of Original Sources, vol. 4, The Early Medieval World (Milwaukee: University Research Extension Co., 1901), 211–239."
          onClose={() => setShowFootnote(null)}
        />
      )}
    </div>
  )
}
