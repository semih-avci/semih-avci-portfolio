<?php 
require_once 'config.php'; // Ta connexion PDO

$title = "À propos - Avci Semih";
$css = "themes/apr.css";
$page = "apropos";

// Requête PHP pour récupérer les stats en SQL
$query = $pdo->query("SELECT * FROM profile_stats");
$stats = $query->fetchAll();

include 'header.php'; 
?>

<div class="about-container">
    <div class="identity-card">
        <div class="id-content">
            <span class="tech-tag">Profil Étudiant</span>
            <h1>Avci Semih<span class="dot-gold">.</span></h1>
            
            <div class="bio-text">
                <p>Passionné par la cybersécurité et les réseaux...</p>
            </div>

            <div class="stats-grid" style="display: flex; gap: 20px; margin-top: 30px;">
                <?php foreach($stats as $stat): ?>
                <div class="stat-item" style="text-align: center; flex: 1;">
                    <i class="fas <?php echo $stat['icon']; ?>" style="color: #D4AF37;"></i>
                    <h3 class="counter" data-target="<?php echo $stat['stat_value']; ?>">0</h3>
                    <p style="font-size: 0.8rem; text-transform: uppercase;"><?php echo $stat['label']; ?></p>
                </div>
                <?php endforeach; ?>
            </div>

            <div class="id-actions" style="margin-top: 40px;">
                <a href="contact.php" class="btn-gold">Me Contacter</a>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const speed = 100; // Plus c'est haut, plus c'est lent
        
        const updateCount = () => {
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };

    // On lance l'animation quand l'utilisateur voit la section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) animateCounter(entry.target);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
});
</script>

<?php include 'footer.php'; ?>
