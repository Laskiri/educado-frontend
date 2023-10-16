// This is ugly, but we couldn't get string concatenation to do the trick

const statuses = {
    'published': {
        'color': 'bg-success',
        'br': 'Publicado',
    },
    'draft': {
        'color': 'bg-[#ffc500]',
        'br': 'Rascunho',
    },
    'hidden': {
        'color': 'bg-grayMedium',
        'br': 'Oculto',
    },
    default: {
        'color': 'bg-[#FF00FF]',
    }
}

export default statuses;