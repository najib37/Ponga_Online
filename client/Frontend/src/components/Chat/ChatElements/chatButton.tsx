interface ButtonProps {
  action: string;
  onClick?: () => void;
}

const Button = ({ action, onClick }: ButtonProps) => {
  return (
    <button
      className="w-fit h-full px-1 bg-[red] text-black text-sm lg:text-xl hover:text-white border-[3px] border-black"
      style={{ fontFamily: 'ComicStandar' }}
      onClick={onClick}
    >
      {action}
    </button>
  );
};

export default Button;