module.exports.default = [
    {
        type: 'multiSelect',
        name: 'extensions',
        message: 'Comma separated extensions to use for markdown',
        hint: 'More extensions can be added in _roxi/roxi.config.yaml',
        initial: ['.md', '.svx'],
        choices: ['.md', '.svx']        
    }
]