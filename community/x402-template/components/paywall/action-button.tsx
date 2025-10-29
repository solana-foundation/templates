interface ActionButtonProps {
  text: string
  onClick: () => void
  disabled: boolean
  isLoading: boolean
}

export function ActionButton({ text, onClick, disabled, isLoading }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full py-4.5 px-4 text-lg font-bold text-white bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-xl cursor-pointer transition-all shadow-lg shadow-purple-500/30 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0"
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <span className="inline-block w-5 h-5 border-3 border-gray-200 border-t-[#9945FF] rounded-full animate-spin mr-2"></span>
          {text}
        </span>
      ) : (
        text
      )}
    </button>
  )
}
