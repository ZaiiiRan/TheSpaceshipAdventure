const main = (() => {
    document.getElementsByTagName('main')[0].style.display = 'block'

    window.onload = function() {
        document.getElementsByTagName('body')[0].classList.remove('preload')
    }
})()
