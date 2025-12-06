export const AboutModal = ({ isOpen, onClose }: any) => isOpen ? <div className='fixed inset-0 bg-black/50 text-white p-10' onClick={onClose}>Sobre</div> : null;
