export const HowItWorksModal = ({ isOpen, onClose }: any) => isOpen ? <div className='fixed inset-0 bg-black/50 text-white p-10' onClick={onClose}>Como Funciona</div> : null;
