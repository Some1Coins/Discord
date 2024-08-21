// backup.js
const { exec } = require('child_process');
const path = require('path');
const cron = require('node-cron');

// Chemin où les sauvegardes seront enregistrées
const backupPath = path.join(__dirname, 'backups');

// Fonction de sauvegarde de la base de données
function backupDatabase() {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupFile = path.join(backupPath, `backup-${timestamp}.sql`);

    exec(`sqlite3 ${path.join(__dirname, 'database.sqlite')} .dump > ${backupFile}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de la sauvegarde de la base de données : ${error.message}`);
            return;
        }
        console.log(`Sauvegarde de la base de données réussie : ${backupFile}`);
    });
}

// Planification de la sauvegarde tous les jours à minuit
cron.schedule('0 0 * * *', backupDatabase);
