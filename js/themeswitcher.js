(() => {
    isDark = (localStorage.getItem('darkmode') === 'true') ? true : false
    if (isDark) {
        SwitchTheme()
    }
})()

const DarkModeSwitcher = (() => {
    const icons = ['<svg viewBox="-3.5 -3.5 31 29" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="5" stroke="#c7c7c7" stroke-width="1.5"></circle> <path d="M12 2V4" stroke="#c7c7c7" stroke-width="1.5" stroke-linecap="round"></path> <path d="M12 20V22" stroke="#c7c7c7" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4 12L2 12" stroke="#c7c7c7" stroke-width="1.5" stroke-linecap="round"></path> <path d="M22 12L20 12" stroke="#c7c7c7" stroke-width="1.5" stroke-linecap="round"></path> <path d="M19.7778 4.22266L17.5558 6.25424" stroke="#c7c7c7" stroke-width="1.5" stroke-linecap="round"></path> <path d="M4.22217 4.22266L6.44418 6.25424" stroke="#c7c7c7" stroke-width="1.5" stroke-linecap="round"></path> <path d="M6.44434 17.5557L4.22211 19.7779" stroke="#c7c7c7" stroke-width="1.5" stroke-linecap="round"></path> <path d="M19.7778 19.7773L17.5558 17.5551" stroke="#c7c7c7" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>',
    '<svg viewBox="-3 0 29 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z" stroke="#545454" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>']
    const themeIcon = document.getElementById('theme-icon');

    (() => {
        if (isDark) themeIcon.innerHTML = icons[0]
    })()

    const themeSwitcher = document.getElementById('theme-switch')

    themeSwitcher.addEventListener('click', () => {
        isDark = !isDark
        if (isDark) themeIcon.innerHTML = icons[0]
        else themeIcon.innerHTML = icons[1]
        SwitchTheme()
        if (isDark) localStorage.setItem('darkmode', 'true')
        else localStorage.setItem('darkmode', 'false')
    })
})()