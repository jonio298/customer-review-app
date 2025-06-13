import React, { useEffect, useRef, useState } from 'react';

const Game = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;

    let bullets = [];
    let asteroids = [];
    let player = { x: canvas.width / 2 - 15, y: canvas.height - 30, width: 30, height: 10 };
    let asteroidTimer = 0;
    let gameOver = false;

    const spawnAsteroid = () => {
      const x = Math.random() * (canvas.width - 20);
      asteroids.push({ x, y: 0, size: 20, speed: 2 + Math.random() * 2 });
    };

    const shootBullet = () => {
      bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Player
      ctx.fillStyle = '#5aa2dd';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Bullets
      ctx.fillStyle = '#ffffff';
      bullets.forEach((b, i) => {
        b.y -= 5;
        ctx.fillRect(b.x, b.y, b.width, b.height);
        if (b.y < 0) bullets.splice(i, 1);
      });

      // Asteroids
      ctx.fillStyle = '#ff5050';
      asteroids.forEach((a, ai) => {
        a.y += a.speed;
        ctx.beginPath();
        ctx.arc(a.x + a.size / 2, a.y + a.size / 2, a.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Bullet collision
        bullets.forEach((b, bi) => {
          if (
            b.x < a.x + a.size &&
            b.x + b.width > a.x &&
            b.y < a.y + a.size &&
            b.y + b.height > a.y
          ) {
            bullets.splice(bi, 1);
            asteroids.splice(ai, 1);
            setScore(prev => prev + 1);
          }
        });

        // Asteroid hits bottom
        if (a.y + a.size > canvas.height) {
          asteroids.splice(ai, 1);
          setLives(prev => {
            const remaining = prev - 1;
            if (remaining <= 0 && !gameOver) {
              gameOver = true;
              if (score > highScore) setHighScore(score);
              setTimeout(() => alert('💥 Game Over! Final Score: ' + score), 100);
              setScore(0);
              setLives(3);
              bullets = [];
              asteroids = [];
              gameOver = false;
            }
            return remaining;
          });
        }
      });
    };

    const loop = setInterval(() => {
      draw();
      asteroidTimer++;
      if (asteroidTimer % 45 === 0) spawnAsteroid();
    }, 1000 / 30);

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      player.x = e.clientX - rect.left - player.width / 2;
    };

    const handleShoot = (e) => {
      if (e.code === 'Space') shootBullet();
    };

    canvas.addEventListener('mousemove', handleMove);
    window.addEventListener('keydown', handleShoot);

    return () => {
      clearInterval(loop);
      canvas.removeEventListener('mousemove', handleMove);
      window.removeEventListener('keydown', handleShoot);
    };
  }, [score, highScore]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} style={{ backgroundColor: '#000', borderRadius: '8px' }}></canvas>
      <p style={{ color: '#fff' }}>Score: {score} | High Score: {highScore} | Lives: {lives}</p>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>[Move mouse to aim, press space to shoot]</p>
    </div>
  );
};

export default Game;
