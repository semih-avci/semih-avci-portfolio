<?php
// 1. Définition des variables (ces textes pourraient plus tard venir d'une base SQL)
$page_title = "À propos - Avci Semih";
$meta_desc = "Découvrez le profil de Semih Avci, étudiant en BUT Réseaux et Télécommunications à l'IUT Clermont Auvergne.";

$nom = "Avci Semih";
$role = "Étudiant en BUT Réseaux & Télécoms";
$statut = "Recherche d'alternance";
$tag = "Profil Étudiant";

$bio_1 = "Passionné depuis mes 14 ans par la cybersécurité, je suis actuellement en formation à l'<strong>IUT Clermont Auvergne</strong>.";
$bio_2 = "Mon parcours scientifique (Bac Général avec les spécialités Maths/Sciences de l'ingénieur/NSI, Licence Maths-Informatique) m'a permis de développer une rigueur. Aujourd'hui, je souhaite mettre ma <strong>rigueur</strong>, ma <strong>patience</strong> et mon <strong>organisation</strong> au service d'une entreprise.";
$objectif = "Je souhaiterais faire une alternance à partir de septembre 2026 où je serai dans un rythme de 1 mois en formation et 1 mois en entreprise.";

// 2. Inclusion du Header (votre fichier commun contenant le <head> et la <nav>)
include 'header.php'; 
?>

<main class="about-container">
    <div class="identity-card" id="idCard">
        <div class="id-photo-wrapper">
            <div class="photo-frame">
                <img src="images/matete.jpeg" alt="<?php echo $nom; ?>" class="id-photo">
            </div>
            <div class="status-indicator">
                <span class="dot"></span> <?php echo $statut; ?>
            </div>
        </div>
        
        <div class="id-content">
            <span class="tech-tag"><?php echo $tag; ?></span>
            <h1><?php echo $nom; ?><span class="dot-gold">.</span></h1>
            <h2 class="role"><?php echo $role; ?></h2>
            <div class="separator-line"></div>
            
            <div class="bio-text">
                <p><?php echo $bio_1; ?></p>
                <p><?php echo $bio_2; ?></p>
                <p class="highlight">Objectif : <?php echo $objectif; ?></p>
            </div>

            <div class="id-actions">
                <a href="contact.php" class="btn-gold">Me Contacter</a>
                <div class="info-badges">
                    <span>Clermont-Ferrand</span>
                    <span>•</span>
                    <span>1ère Année</span>
                </div>
            </div>
        </div>
    </div>
</main>

<script>
    // Petit script JS pour une apparition fluide de la carte au chargement
    document.addEventListener('DOMContentLoaded', () => {
        const card = document.getElementById('idCard');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.8s ease-out';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
</script>

<?php 
// 3. Inclusion du Footer (contenant le <footer> et la fermeture des balises </body> </html>)
include 'footer.php'; 
?>
