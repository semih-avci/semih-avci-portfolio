<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Découvrez le profil de Semih Avci, étudiant en BUT Réseaux et Télécommunications.">
    <title><?php echo isset($title) ? $title : 'Portfolio - Avci Semih'; ?></title>
    
    <?php if(isset($css)): ?>
    <link rel="stylesheet" href="<?php echo $css; ?>">
    <?php endif; ?>
    
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <a href="index.php" class="nav-brand">
            <img src="images/logosemih.png" alt="Logo Avci Semih" class="nav-logo-img">
        </a>

        <input type="checkbox" id="nav-toggle" class="nav-toggle">

        <label for="nav-toggle" class="nav-burger">
            <span></span>
            <span></span>
            <span></span>
        </label>

        <div class="nav-links">
            <a href="index.php" class="<?php echo ($page == 'accueil') ? 'active' : ''; ?>">Accueil</a>
            <a href="apropos.php" class="<?php echo ($page == 'apropos') ? 'active' : ''; ?>">À propos</a>
            <a href="parcours.php" class="<?php echo ($page == 'parcours') ? 'active' : ''; ?>">Parcours</a>
            <a href="experience.php" class="<?php echo ($page == 'experience') ? 'active' : ''; ?>">Expérience</a>
            <a href="competences.php" class="<?php echo ($page == 'competences') ? 'active' : ''; ?>">Compétences</a>
            <a href="projets.php" class="<?php echo ($page == 'projets') ? 'active' : ''; ?>">Projets</a>
            <a href="divers.php" class="<?php echo ($page == 'divers') ? 'active' : ''; ?>">Divers</a>
            <a href="contact.php" class="<?php echo ($page == 'contact') ? 'active' : ''; ?>">Contact</a>
            
            <a href="CV-AVCI-Semih.jpeg" target="_blank" class="btn-cv-mobile">Mon CV</a>
        </div>

        <a href="CV-AVCI-Semih.pdf" target="_blank" class="btn-cv-desktop">Mon CV</a>
    </nav>
