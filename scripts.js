document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    const appList = document.getElementById('app-list');

    if (uploadForm) {
        uploadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const appName = document.getElementById('app-name').value;
            const appDescription = document.getElementById('app-description').value;
            const appImage = document.getElementById('app-image').files[0];
            const appApk = document.getElementById('app-apk').files[0];
            
            const appImageRef = storage.ref().child(`images/${appImage.name}`);
            const appApkRef = storage.ref().child(`apks/${appApk.name}`);
            
            appImageRef.put(appImage).then(snapshot => {
                snapshot.ref.getDownloadURL().then(imageUrl => {
                    appApkRef.put(appApk).then(snapshot => {
                        snapshot.ref.getDownloadURL().then(apkUrl => {
                            const appItem = {
                                name: appName,
                                description: appDescription,
                                imageUrl: imageUrl,
                                apkUrl: apkUrl
                            };

                            saveApp(appItem);
                            alert('App publicado com sucesso!');
                            window.location.href = 'index.html';
                        });
                    });
                });
            });
        });
    }

    if (appList) {
        displayApps();
    }

    function saveApp(appItem) {
        db.collection('apps').add(appItem).then(() => {
            displayApps();
        }).catch(error => {
            console.error('Erro ao salvar app: ', error);
        });
    }

    function displayApps() {
        db.collection('apps').get().then(querySnapshot => {
            appList.innerHTML = '';
            querySnapshot.forEach(doc => {
                const app = doc.data();
                const appElement = document.createElement('div');
                appElement.classList.add('app-item');
                appElement.innerHTML = `
                    <img src="${app.imageUrl}" alt="${app.name}" class="app-image">
                    <h3>${app.name}</h3>
                    <p>${app.description}</p>
                    <a href="${app.apkUrl}" download>Baixar APK</a>
                `;
                appList.appendChild(appElement);
            });
        }).catch(error => {
            console.error('Erro ao carregar apps: ', error);
        });
    }
});
