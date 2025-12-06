export const getRarityStyles = (rarity?: string) => {
    switch(rarity) {
        case 'Lendária': return { color: '#fbbf24', border: '1px solid #fbbf24' };
        case 'Épica': return { color: '#a855f7', border: '1px solid #a855f7' };
        case 'Rara': return { color: '#3b82f6', border: '1px solid #3b82f6' };
        default: return { color: '#9ca3af', border: '1px solid #4b5563' };
    }
};
