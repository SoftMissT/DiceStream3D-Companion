export const DetailModal = ({ isOpen, onClose }: any) => isOpen ? <div className='fixed inset-0 bg-black/50 text-white p-10' onClick={onClose}>Detalhes</div> : null;
