
import React from 'react';

export const LogoIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="currentColor" fillOpacity="0.1"/>
    <path d="M12 8h4" />
    <path d="M12 12h4" />
    <path d="M9 16h2" />
  </svg>
);

export const HomeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
  </svg>
);

export const PenIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
  </svg>
);

export const FountainPenIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-40h80v40h560v-40h80v40q0 33-23.5 56.5T760-120H200Zm280-160L360-400h240L480-280Z"/>
        <path d="M480-280 320-440v-280q0-83 58.5-141.5T520-920q83 0 141.5 58.5T720-720v280L560-280H480Z" opacity="0.5"/>
    </svg>
);

export const BallPenIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M440-200v-560h80v560h-80Zm0 80v-40h80v40q0 17-11.5 28.5T480-80q-17 0-28.5-11.5T440-120Z"/>
    </svg>
);

export const BrushPenIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
         <path d="M480-80q-50 0-85-35t-35-85v-120h240v120q0 50-35 85t-85 35ZM320-440v-280h320v280H320Z"/>
         <path d="M480-720q0-33 23.5-56.5T560-800q33 0 56.5 23.5T640-720h-40q0-17-11.5-28.5T560-760q-17 0-28.5 11.5T520-720h-40Z"/>
    </svg>
);

export const HighlighterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M840-200v80H120v-80h720Zm-512-80 28-168 128-128 174 174-128 128-202-6Zm326-174L480-628l128-128 174 174-128 128Zm-334 34L120-620l360-360 160 160-320 320Z"/>
  </svg>
);

export const EraserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="m376-240 104-104 100 100-104 104H376v-100Zm-336 0v-112l496-496q19-19 45-19t45 19l112 112q19 19 19 45t-19 45L312-120H40Zm736 120h80v-80h-80v80Zm-608-80h24l-24-24v24Z"/>
  </svg>
);

export const TextIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M420-160v-520H200v-120h560v120H540v520H420Z"/>
  </svg>
);

export const SelectIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M200-200v-560l560 560-240 240-320-240Zm80-120 184 140 160-160-344-344v364Zm0 0v-364 364Z"/>
  </svg>
);

export const LassoIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
     <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-160q67 0 113.5-46.5T640-480q0-67-46.5-113.5T480-640q-67 0-113.5 46.5T320-480q0 67 46.5 113.5T480-320Z"/>
  </svg>
);

export const ShapeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm80-80h480v-320H240v320Zm-80 80v-480 480Z"/>
  </svg>
);

export const ImageIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/>
  </svg>
);

export const StickyNoteIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
     <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v360L640-200H200Zm0-80h400v-160h160v-360H200v520Z"/>
  </svg>
);

export const MicIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Z"/>
  </svg>
);

export const AddIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
  </svg>
);

export const ShareIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Z"/>
  </svg>
);

export const MoreIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/>
  </svg>
);

export const CloudDoneIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M280-240q-66 0-113-47t-47-113q0-54 33.5-98.5T240-562q15-97 90.5-157.5T492-780q105 0 183.5 68T765-544q56 8 95.5 50t39.5 94q0 66-47 113t-113 47H280Zm200-80 184-184-56-56-128 128-72-72-56 56 128 128Z"/>
    </svg>
);

export const CloudSyncIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M280-240q-66 0-113-47t-47-113q0-54 33.5-98.5T240-562q15-97 90.5-157.5T492-780q78 0 144.5 37.5T742-642l-58 58q-23-34-58-55t-78-21q-79 0-138.5 52.5T340-474q-42 6-71 37.5T240-366q0 40 29 67t71 27h340v80H280Zm446-54-56-56 56-56 56 56-56 56Z"/>
    </svg>
);

export const CloudOffIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
         <path d="M792-56 676-172q-32 10-65.5 16T548-150v-82q19 0 37-3t36-9l-57-57q-22 5-45.5 8T480-290q-106 0-186-67t-92-169H120q13 138 116 222t244 84q51 0 99-13.5t92-39.5l121 121 56-56-56-56ZM556-348 274-630q-6 20-9 40t-3 40q0 86 54.5 150.5T452-340l104-8Zm244 8q0-88-56-155.5T600-572v-92q105 13 182.5 90t77.5 186q0 30-6.5 58T836-276L780-332q3-10 6.5-21t3.5-21ZM480-720q52 0 98 23t80 63l60-60q-48-52-113-81t-137-29q-94 0-174 44.5T162-638l68 68q30-50 78.5-79T480-720Z"/>
    </svg>
);

export const DragHandleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
     <path d="M9 3H11V21H9V3ZM13 3H15V21H13V3Z" />
  </svg>
);

export const SquareIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
);

export const CircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
);

export const TriangleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 4L4 20H20L12 4Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
    </svg>
);

export const FillIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM10.5 13.5L9.5 17L6 13.5L10.5 9L15 13.5H10.5Z" />
         <path d="M16.56 11.44L12.5 7.38C12.4 7.28 12.28 7.21 12.14 7.14C11.83 7 11.5 7 11.2 7.14C11.06 7.21 10.94 7.28 10.84 7.38L6.78 11.44C6.58 11.64 6.58 11.96 6.78 12.16L10.84 16.22C10.94 16.32 11.06 16.39 11.2 16.46C11.34 16.53 11.5 16.56 11.67 16.56C11.84 16.56 12 16.53 12.14 16.46C12.28 16.39 12.4 16.32 12.5 16.22L16.56 12.16C16.76 11.96 16.76 11.64 16.56 11.44Z" fill="currentColor" opacity="0.5"/>
    </svg>
);

export const StrokeWidthIcon = ({ className, height = 8 }: { className?: string, height?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
         <rect x="2" y={12 - height/2} width="20" height={height} rx={height/2} fill="currentColor" />
    </svg>
);

export const RefreshIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
         <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v240H560v-80h135q-41-56-101-88t-114-32q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>
    </svg>
);

export const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
    </svg>
);

export const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
    </svg>
);

export const PaletteIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 36-6 70.5T856-343q-13 36-41 57t-64 21q-17 0-33-6t-28-18l-37-37q-10-10-21.5-15t-24.5-5q-27 0-45 17.5T544-284v42q0 40-24 67t-58 39q-12 1-24 1.5t-24 .5v54Zm0-80v-42q0-61 36.5-104t96.5-54q10 0 17 5.5t7 14.5q0 10 11.5 24.5T682-302l37 37q28 28 65.5 36.5T856-237q35-46 59.5-101T940-480q0-191-134.5-325.5T480-940q-191 0-325.5 134.5T20-480q0 191 134.5 325.5T480-20v-80Zm-220-400q17 0 28.5-11.5T300-520q0-17-11.5-28.5T260-560q-17 0-28.5 11.5T220-520q0 17 11.5 28.5T260-480Zm120-160q17 0 28.5-11.5T420-680q0-17-11.5-28.5T380-720q-17 0-28.5 11.5T340-680q0 17 11.5 28.5T380-640Zm200 0q17 0 28.5-11.5T620-680q0-17-11.5-28.5T580-720q-17 0-28.5 11.5T540-680q0 17 11.5 28.5T580-640Zm120 160q17 0 28.5-11.5T740-520q0-17-11.5-28.5T700-560q-17 0-28.5 11.5T660-520q0 17 11.5 28.5T700-480Z"/>
    </svg>
);

export const MenuIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
    </svg>
);

export const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
    </svg>
);

export const NoteIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l200 200v440q0 33-23.5 56.5T800-120H200Zm0-80h600v-440H640v-160H200v600Zm0 0v-600 600Zm280-280Z"/>
    </svg>
);

export const BoardIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M120-120v-80h80v-560h560v560h80v80H120Zm160-80h400v-400H280v400Z"/>
    </svg>
);

export const DocumentIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T760-80H240Zm0-80h520v-400H520v-240H240v640Zm0-640v240-240 640-640Z"/>
    </svg>
);

export const FolderIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/>
    </svg>
);

export const StarIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
    </svg>
);

export const PeopleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-5.5t28-2.5q66 0 113 47t47 113Z"/>
    </svg>
);

export const StoreIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
         <path d="M240-120v-120H120v-520h720v520H720v120H240Zm120-120h240v-120H360v120Z"/>
    </svg>
);

export const TrashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
    </svg>
);

export const SettingsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
    </svg>
);

export const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
    </svg>
);

export const MagicIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M160-360v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm160 320v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80ZM360-600l100-240 100 240-100 240-100-240Z"/>
    </svg>
);

export const LayoutTopIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-520h560v-120H200v120Zm0 80v360h560v-360H200Z"/>
    </svg>
);

export const LayoutLeftIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm160-80h400v-560H360v560Zm-80-560v560h-80v-560h80Z"/>
    </svg>
);

export const LayoutRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm480-80h80v-560h-80v560Zm-400-560v560h320v-560H280Z"/>
    </svg>
);

export const LayoutFloatIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm200-200h160v-160H400v160Z"/>
    </svg>
);

export const VerticalScrollIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M440-120v-720h80v720h-80ZM280-280 120-440l160-160 56 56-103 104 103 104-56 56Zm400 0-56-56 103-104-103-104 56-56 160 160-160 160Z"/>
    </svg>
);

export const HorizontalScrollIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M120-440v-80h720v80H120Zm160-160-56-56 104-103 104 103-56 56-160-160 160 160Zm0 400L280-360l160 160-160 160 56-56 103-104-103-104Z"/>
    </svg>
);

export const ViewSingleIcon = ({ className }: { className?: string }) => (
     <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z"/>
    </svg>
);

export const ViewContinuousIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M160-200v-200h640v200H160Zm0-360v-200h640v200H160Zm0 80h640v200H160v-200Z"/>
    </svg>
);

export const EyeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z"/>
    </svg>
);

export const EditIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
    </svg>
);

export const CutIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M840-120 540-420l-72 72q-12 12-28 12t-28-12l-64-64-52 52q-20 20-51 20t-51-20q-20-20-20-51t20-51l52-52-126-126q-23-23-23-57t23-57q23-23 57-23t57 23l126 126 52-52q20-20 51-20t51 20q20 20 20 51t-20 51l-52 52 64 64q12 12 12 28t-12 28l-72 72 300 300-56 56ZM288-664 168-784q-11-11-11-28t11-28q11-11 28-11t28 11l120 120-56 56Zm-94 400q-12 12-12 28t12 28q12 12 28 12t28-12l160-160-56-56-160 160Z"/>
    </svg>
);

export const CopyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>
    </svg>
);

export const LayersIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M480-80 200-230v-110l280 150 280-150v110L480-80Zm0-160L200-390v-110l280 150 280-150v110L480-240Zm0-160L200-550v-110l280 150 280-150v110L480-400Zm0-160L200-710l280-150 280 150-280 150Z"/>
    </svg>
);

export const DashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={className} fill="currentColor">
        <path d="M2 11h4v2H2v-2zm6 0h4v2H8v-2zm6 0h4v2h-4v-2zm6 0h2v2h-2v-2z" />
    </svg>
);

export const DotIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={className} fill="currentColor">
        <path d="M2 11h2v2H2v-2zm4 0h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" />
    </svg>
);

export const SolidLineIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={className} fill="currentColor">
        <path d="M2 11h20v2H2v-2z" />
    </svg>
);

export const CloseIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
  </svg>
);

export const SendIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/>
  </svg>
);

export const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M440-120v-167q-83-12-149-65.5T200-500q-26 5-43 25t-17 45q0 32 23.5 54.5T220-352q17 0 31.5-6.5T279-376q8 20 22 37.5t33 32.5q-8 15-11 31.5t-3 34.5q0 33 23.5 56.5T400-160h40Zm160 0h40q33 0 56.5-23.5T720-240q0-18-3-34.5t-11-31.5q19-15 33-32.5t22-37.5q14 11 28.5 17.5T820-352q33 0 56.5-22.5T900-430q0-25-17-45t-43-25q-25 76-91 129.5T600-287v167Zm-80-320q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47ZM320-560q-17 0-28.5-11.5T280-600q0-17 11.5-28.5T320-640q17 0 28.5 11.5T360-600q0 17-11.5 28.5T320-560Zm320 0q-17 0-28.5-11.5T600-600q0-17 11.5-28.5T640-640q17 0 28.5 11.5T680-600q0 17-11.5 28.5T640-560ZM120-640q-17 0-28.5-11.5T80-680q0-17 11.5-28.5T120-720q17 0 28.5 11.5T160-680q0 17-11.5 28.5T120-640Zm720 0q-17 0-28.5-11.5T800-680q0-17 11.5-28.5T840-720q17 0 28.5 11.5T880-680q0 17-11.5 28.5T840-640Zm-320-80q-17 0-28.5-11.5T480-760q0-17 11.5-28.5T520-800q17 0 28.5 11.5T560-760q0 17-11.5 28.5T520-720Z"/>
  </svg>
);

export const ZoomInIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Zm-40-140H220v-80h120v-120h80v120h120v80H420v120h-80v-120Z"/>
    </svg>
);

export const ZoomOutIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400ZM220-540v-80h320v80H220Z"/>
    </svg>
);

export const ScanIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M80-680v-200h200v80H160v120H80Zm0 600v-200h80v120h120v80H80Zm600 0v-80h120v-120h80v200H680Zm120-600v-120H680v-80h200v200h-80Zm-400 360-80-80 320-320 120 120-360 360-120-120 80-80 40 40 80-80Z"/>
    </svg>
);

export const UndoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M280-120 80-320l200-200 56 56-104 104h288q100 0 170-70t70-170q0-100-70-170t-170-70H280v-80h240q134 0 227 93t93 227q0 134-93 227t-227 93H232l104 104-56 56Z"/>
    </svg>
);

export const RedoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
        <path d="M680-120 480-320l56-56 104 104h-280q-134 0-227-93t-93-227q0-134 93-227t227-93h240v80H440q-100 0-170 70t-70 170q0 100 70 170t170 70h288L624-576l56-56 200 200-200 200Z"/>
    </svg>
);

export const BringToFrontIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
    <path d="M120-120v-320h80v320h320v-80H120Zm160-160v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80ZM120-600v-240h240v80H200v160h-80Zm440-200v-80h240v240h-80v-160H560Z"/>
  </svg>
);

export const SendToBackIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className={className} fill="currentColor">
     <path d="M200-200v-560h560v560H200Zm80-80h400v-400H280v400Z"/>
  </svg>
);
