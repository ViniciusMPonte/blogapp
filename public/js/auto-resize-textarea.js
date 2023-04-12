function autoResize(textarea) {

    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';

}

let textareaAll = document.querySelectorAll('textarea')

textareaAll.forEach((textarea) => {

    autoResize(textarea)

    textarea.addEventListener('input', () => {

        autoResize(textarea)

    })

})