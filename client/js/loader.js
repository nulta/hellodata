let fileLoadTime = new Date().getTime()
let fileLoaded = function(filename) {
    console.log(
        `%cLoaded: %c%s %c(%sms)`,
        'color: #00dd88',
        'color: inherit',
        filename,
        'color: #0077f8aa',
        new Date().getTime() - fileLoadTime
    );
    fileLoadTime = new Date().getTime();
};

let loadScript = async function(filename) {
    let imported = await
    import (filename);
    fileLoaded(filename.replace(/^.*[\\\/]/, ''));
    return imported.default || imported;
};

(async() => {
    window.Ajax = await loadScript('./ajax.js');
    window.HDT = await loadScript('./hdt.js');
    window.$Page = {};
    await loadScript('./page/page_global.js');
    await loadScript('./meta.js');

    // Load page scripts
    let url = new URL(window.location.href);
    if (url.pathname == "/") {
        // /
        loadScript('./page/index.js');
    } else if (url.pathname.startsWith("/projects/")) {
        // /projects/:ProjectId
        loadScript('./page/project.js');
    } else {
        // etc
        loadScript('./page/' + url.pathname.substring(1) + '.js');
    }
})();