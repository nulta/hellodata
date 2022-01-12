// Metadata Parsing
$(async() => {
    let meta = await HDT.getUserMeta()

    // meta.bg
    if (meta.bg) {
        if (meta.bg.match(/^(#|rgba?|hsv)/)) {
            $(document.body).css("background-color", meta.bg)
        } else if (meta.bg.match(/\.(jpg|png|webp|gif|bmp)$/)) {
            $(document.body).css("background-image", `url(${meta.bg})`)
        } else {
            $(document.body).css("background-image", `${meta.bg}`)
        }
    } else {
        $(document.body).css("background-image", "url('/img/bg2.png')")
    }
})