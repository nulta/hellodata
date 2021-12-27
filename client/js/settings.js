HDT.getCurrentUser().then(user => {
    $("#input-email").val(user.email);
    $("#input-name").val(user.name);
    $("#input-meta").val(JSON.stringify(user.meta));
})

HDT.fileLoaded("projectlist.js");