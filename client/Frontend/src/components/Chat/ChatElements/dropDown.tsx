import {useState, useEffect, useRef} from 'react';
import PopUp from './popUp';

const DropDownList = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const handleOpen = () => {
        setOpen(!open);
    };

    const searchForGroups = (action: string) => {
        setOpen(false);
        setSelectedAction(action);
    };

    const createGroup = (action: string) => {
        setOpen(false);
        setSelectedAction(action);
    };


    const handleClosePopup = () => {
        setSelectedAction(null);
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {


            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        window.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="relative m-auto" ref={dropdownRef}>
            <button
                id="dropdownMenuIconButton"
                data-dropdown-toggle="dropdownDots"
                className="inline-flex items-center p-2 text-sm font-medium text-center text-white"
                type="button"
                onClick={handleOpen}
                aria-expanded={open}
            >
                <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 4 15"
                >
                    <path
                        d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                </svg>
            </button>

            {open ? (
                <ul
                    className="py-4 text-sm text-gray-200 bg-gray-800 border-4 border-black absolute w-[200px] space-y-2 rounded-md shadow-lg top-[50px] right-0 z-50"
                    aria-labelledby="dropdownMenuIconButton"
                >
                    <li
                        onClick={() => searchForGroups('Search For Groups')}
                        style={{fontFamily: 'ComicStandar'}}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md cursor-pointer"
                    >
                        Search For Groups
                    </li>

                    <li
                        onClick={() => createGroup('Create group')}
                        style={{fontFamily: 'ComicStandar'}}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md cursor-pointer"
                    >
                        Create channel
                    </li>
                </ul>
            ) : null}
            {selectedAction && (
                <PopUp
                    onClose={handleClosePopup}
                    actionLabel={selectedAction}
                />
            )}
        </div>
    );
};

export default DropDownList;
