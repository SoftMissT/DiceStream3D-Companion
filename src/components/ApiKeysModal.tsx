export const ApiKeysModal = ({ isOpen, onClose }: any) => isOpen ? <div className='fixed inset-0 bg-black/50 text-white p-10' onClick={onClose}>API Keys</div> : null;
