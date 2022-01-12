HDT.getCurrentUser().then(user => {
    if (user)
        window.location = "./projects";
    else
        window.location = "./auth";
})