import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Lora:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');
`;

const styles = `
  ${FONTS}

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #FAF6F1;
    --charcoal: #1a1410;
    --gold: #D4A574;
    --gold-dark: #8B5A2B;
    --accent: #C85A17;
    --warm-orange: #E89B3C;
    --saffron: #F59B0A;
    --border: #E8D4C0;
    --gray-light: #F9F5F1;
    --text-light: #5a4a42;
    --font-display: 'Playfair Display', serif;
    --font-secondary: 'Lora', serif;
    --font-body: 'Inter', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--charcoal);
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 400;
    line-height: 1.7;
    overflow-x: hidden;
    min-height: 100vh;
  }

  ::selection { background: var(--saffron); color: white; }

  /* NAV */
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 60px;
    background: linear-gradient(135deg, rgba(26, 20, 16, 0.95) 0%, rgba(76, 58, 40, 0.95) 100%);
    backdrop-filter: blur(30px);
    border-bottom: 2px solid var(--saffron);
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .nav-brand {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 700;
    color: var(--saffron);
    text-decoration: none;
    letter-spacing: 1px;
    position: absolute;
    left: 60px;
  }

  .nav-links {
    display: flex;
    gap: 40px;
    list-style: none;
    align-items: center;
  }

  .nav-links a {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: white;
    text-decoration: none;
    transition: all 0.3s;
    position: relative;
  }

  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--saffron);
    transition: width 0.3s;
  }

  .nav-links a:hover {
    color: var(--saffron);
  }

  .nav-links a:hover::after { width: 100%; }

  .social-nav {
    display: flex;
    gap: 16px;
    margin-left: 20px;
    position: absolute;
    right: 60px;
  }

  .social-nav a {
    font-size: 18px;
    text-decoration: none;
    color: var(--saffron);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
  }

  .social-nav a i {
    font-size: 20px;
    transition: all 0.3s ease;
  }

  .social-nav a:hover { 
    color: var(--warm-orange);
    transform: scale(1.15) rotate(5deg);
  }

  .social-nav a:hover i {
    filter: drop-shadow(0 0 6px var(--saffron));
  }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 120px 48px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(26, 20, 16, 0.75) 0%, rgba(76, 58, 40, 0.75) 50%, rgba(61, 40, 23, 0.75) 100%), 
                url('/images/6.png') center/cover no-repeat fixed;
    background-attachment: fixed;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(to right, rgba(232, 155, 60, 0.1) 0%, transparent 50%, rgba(200, 90, 23, 0.08) 100%);
    pointer-events: none;
  }

  .hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 2px 2px, rgba(245, 155, 10, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(52px, 10vw, 100px);
    font-weight: 800;
    line-height: 1;
    color: white;
    margin-bottom: 20px;
    letter-spacing: -1px;
    text-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }

  .hero-italic { 
    color: var(--saffron); 
    font-style: italic;
    display: block;
    text-shadow: 0 4px 12px rgba(245, 155, 10, 0.3);
  }

  .hero-sub {
    font-size: 19px;
    color: rgba(255, 255, 255, 0.95);
    max-width: 650px;
    margin-bottom: 48px;
    line-height: 1.8;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .hero-cta {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }

  .btn {
    padding: 16px 36px;
    border-radius: 6px;
    border: none;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    text-decoration: none;
    display: inline-block;
    text-transform: uppercase;
  }

  .btn-primary {
    background: linear-gradient(135deg, #F59B0A 0%, #E89B3C 100%);
    color: white;
    box-shadow: 0 12px 24px rgba(232, 155, 60, 0.4);
    border: none;
  }

  .btn-primary:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(232, 155, 60, 0.6);
  }

  .btn-secondary {
    border: 2.5px solid var(--saffron);
    color: white;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  .btn-secondary:hover {
    background: var(--saffron);
    color: white;
    border-color: var(--saffron);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(245, 155, 10, 0.3);
  }

  /* SECTIONS */
  section {
    padding: 120px 48px;
    position: relative;
  }

  .section-label {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--saffron);
    margin-bottom: 12px;
  }

  .section-title {
    font-family: var(--font-display);
    font-size: clamp(42px, 6vw, 72px);
    font-weight: 800;
    color: var(--charcoal);
    margin-bottom: 64px;
    line-height: 1.1;
    letter-spacing: -1px;
  }

  /* ABOUT */
  .about-section {
    background: linear-gradient(135deg, rgba(232, 155, 60, 0.06) 0%, rgba(200, 90, 23, 0.03) 100%);
  }

  .about-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .about-text h3 {
    font-family: var(--font-display);
    font-size: 36px;
    font-weight: 800;
    color: var(--charcoal);
    margin-bottom: 24px;
    line-height: 1.2;
  }

  .about-text p {
    margin-bottom: 24px;
    color: var(--text-light);
    line-height: 1.9;
    font-size: 16px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 40px;
  }

  .feature-box {
    background: white;
    padding: 28px;
    border-radius: 8px;
    border-left: 4px solid var(--saffron);
    box-shadow: 0 4px 12px rgba(26, 20, 16, 0.06);
  }

  .feature-box strong {
    color: var(--accent);
    font-size: 18px;
    display: block;
    margin-bottom: 8px;
  }

  .feature-box p {
    margin-bottom: 0;
    font-size: 14px;
  }

  /* MENU */
  .menu-section {
    background: linear-gradient(135deg, #FAF6F1 0%, #FFE8D6 100%);
  }

  .menu-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
    margin-top: 60px;
  }

  .menu-category {
    background: white;
    padding: 32px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(26, 20, 16, 0.1);
    border-left: 5px solid var(--saffron);
    transition: all 0.3s ease;
  }

  .menu-category:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(26, 20, 16, 0.15);
  }

  .menu-category-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--saffron);
  }

  .menu-items-grid {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px dotted rgba(212, 165, 116, 0.3);
  }

  .menu-item:last-child {
    border-bottom: none;
  }

  .menu-item-name {
    font-size: 15px;
    color: var(--charcoal);
    font-weight: 500;
    flex: 1;
  }

  .menu-item-price {
    font-size: 15px;
    font-weight: 700;
    color: var(--saffron);
    margin-left: 16px;
    white-space: nowrap;
  }

  .menu-images {
    margin: 64px 0 80px 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 32px;
  }

  .menu-image-box {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 16px 40px rgba(26, 20, 16, 0.2);
    transition: transform 0.3s ease;
  }

  .menu-image-box:hover {
    transform: translateY(-8px);
  }

  .menu-image-box img {
    width: 100%;
    height: auto;
    display: block;
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;
  }

  .menu-card {
    background: white;
    padding: 36px;
    border-radius: 8px;
    border-left: 5px solid var(--saffron);
    transition: all 0.3s ease;
    box-shadow: 0 6px 16px rgba(26, 20, 16, 0.08);
  }

  .menu-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 32px rgba(26, 20, 16, 0.15);
  }

  .menu-card-title {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 12px;
  }

  .menu-card-items {
    font-size: 14px;
    color: var(--text-light);
    line-height: 1.9;
  }

  .menu-price {
    font-size: 15px;
    font-weight: 700;
    color: var(--saffron);
    margin-top: 18px;
    border-top: 1px solid var(--border);
    padding-top: 16px;
  }

  /* HIGHLIGHTS */
  .highlights-section {
    background: linear-gradient(135deg, rgba(200, 90, 23, 0.08) 0%, rgba(232, 155, 60, 0.04) 100%);
  }

  .highlights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 32px;
  }

  .highlight-card {
    background: white;
    padding: 40px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 8px 20px rgba(26, 20, 16, 0.08);
  }

  .highlight-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .highlight-card h4 {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 12px;
  }

  .highlight-card p {
    color: var(--text-light);
    font-size: 14px;
    line-height: 1.7;
  }

  /* REVIEWS */
  .testimonials-section {
    background: linear-gradient(135deg, #3D2817 0%, #4D3A28 100%);
    color: white;
    padding-top: 80px;
  }

  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 28px;
    margin-top: 64px;
  }

  .review-card {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(245, 155, 10, 0.15);
    border-radius: 12px;
    padding: 24px;
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: relative;
    overflow: hidden;
  }

  .review-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--saffron), var(--warm-orange), transparent);
  }

  .review-card.new {
    border-color: rgba(245, 155, 10, 0.3);
    background: rgba(255, 255, 255, 0.09);
  }

  .review-card:hover {
    transform: translateY(-6px);
    border-color: rgba(245, 155, 10, 0.35);
    background: rgba(255, 255, 255, 0.11);
    box-shadow: 0 20px 60px rgba(245, 155, 10, 0.1);
  }

  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  .review-author-info {
    flex: 1;
  }

  .review-author-name {
    font-weight: 700;
    font-size: 14px;
    color: white;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .local-guide-badge {
    background: linear-gradient(135deg, var(--saffron) 0%, var(--warm-orange) 100%);
    color: #1a1410;
    padding: 3px 10px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .review-meta {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .review-meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .new-badge {
    background: var(--saffron);
    color: #1a1410;
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .review-stars {
    color: var(--saffron);
    font-size: 14px;
    letter-spacing: 3px;
    flex-shrink: 0;
  }

  .review-text {
    font-size: 13px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.88);
    font-style: italic;
  }

  .owner-response-section {
    margin-top: 10px;
    padding-top: 14px;
    border-top: 1px solid rgba(245, 155, 10, 0.12);
  }

  .owner-response-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--saffron);
    letter-spacing: 0.8px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .owner-response-label::before {
    content: '🏢';
    font-size: 12px;
  }

  .owner-response-text {
    font-size: 12px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.78);
  }

  .owner-response-time {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 6px;
  }

  /* LOCATION */
  .location-section {
    background: linear-gradient(135deg, rgba(232, 155, 60, 0.08) 0%, rgba(200, 90, 23, 0.03) 100%);
  }

  .location-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  .location-info {
    background: white;
    padding: 48px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(26, 20, 16, 0.1);
  }

  .location-info h3 {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 32px;
  }

  .location-item {
    margin-bottom: 32px;
  }

  .location-label {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--saffron);
    margin-bottom: 8px;
  }

  .location-value {
    font-size: 16px;
    color: var(--charcoal);
    font-weight: 600;
    line-height: 1.6;
  }

  .map-container {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(26, 20, 16, 0.1);
    aspect-ratio: 4/3;
  }

  .map-container iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  /* CONTACT */
  .contact-section {
    background: linear-gradient(135deg, #3D2817 0%, #4D3A28 100%);
    color: white;
  }

  .contact-content {
    max-width: 700px;
  }

  .contact-section .section-label {
    color: var(--saffron);
  }

  .contact-form {
    margin-top: 48px;
    display: grid;
    gap: 24px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .form-group {
    margin-bottom: 0;
  }

  .form-group label {
    display: block;
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--saffron);
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 14px 18px;
    border: 1px solid rgba(245, 155, 10, 0.3);
    background: rgba(255, 255, 255, 0.06);
    color: white;
    font-family: var(--font-body);
    border-radius: 6px;
    transition: all 0.3s;
    font-size: 14px;
  }

  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--saffron);
    background: rgba(255, 255, 255, 0.12);
  }

  .form-group textarea { 
    resize: vertical; 
    min-height: 140px;
    grid-column: 1 / -1;
  }

  .form-submit {
    background: linear-gradient(135deg, #F59B0A 0%, #E89B3C 100%);
    color: white;
    padding: 16px 40px;
    border: none;
    border-radius: 6px;
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.3s ease;
    grid-column: 1 / -1;
  }

  .form-submit:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 32px rgba(232, 155, 60, 0.4);
  }

  /* FOOTER */
  footer {
    padding: 60px 48px 40px;
    background: linear-gradient(135deg, #FAF6F1 0%, #F5EFEA 100%);
    border-top: 1px solid var(--border);
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 48px;
    margin-bottom: 48px;
  }

  .footer-section h4 {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 16px;
  }

  .footer-section p,
  .footer-section a {
    font-size: 14px;
    color: var(--text-light);
    line-height: 1.8;
    text-decoration: none;
    display: block;
    margin-bottom: 8px;
  }

  .footer-section a:hover {
    color: var(--accent);
  }

  .footer-social {
    display: flex;
    gap: 16px;
    margin-top: 12px;
  }

  .footer-social a {
    font-size: 18px;
    margin-bottom: 0;
    transition: transform 0.2s;
  }

  .footer-social a:hover {
    transform: scale(1.2);
  }

  .footer-bottom {
    border-top: 1px solid var(--border);
    padding-top: 32px;
    text-align: center;
    color: rgba(26, 20, 16, 0.6);
    font-size: 13px;
  }

  /* 3D TILT GALLERY */
  .gallery-tilt-section {
    background: linear-gradient(135deg, #1a1410 0%, #3D2817 50%, #2D2217 100%);
    padding: 120px 48px;
    position: relative;
  }

  .gallery-tilt-section .section-title {
    color: var(--saffron);
    text-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }

  .gallery-tilt-section .section-label {
    color: var(--warm-orange);
  }

  .tilt-gallery-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 48px;
    margin-top: 80px;
  }

  .tilt-card {
    perspective: 1200px;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
    will-change: transform, opacity;
    height: 480px;
  }

  .tilt-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
  }

  .tilt-card:hover .tilt-card-inner {
    box-shadow: 0 30px 80px rgba(245, 155, 10, 0.25);
  }

  .tilt-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.8s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .tilt-card:hover .tilt-card-image {
    transform: scale(1.08) rotate(2deg);
  }

  .tilt-card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(26,20,16,0.4) 0%, rgba(61,40,23,0.6) 100%);
    backdrop-filter: blur(2px);
    z-index: 1;
    transition: all 0.6s ease;
  }

  .tilt-card:hover .tilt-card-overlay {
    backdrop-filter: blur(4px);
    background: linear-gradient(135deg, rgba(245,155,10,0.1) 0%, rgba(232,155,60,0.15) 100%);
  }

  .tilt-card-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 40px 32px;
    z-index: 2;
    transform: translateY(30px);
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .tilt-card:hover .tilt-card-content {
    transform: translateY(0);
    opacity: 1;
  }

  .tilt-card-title {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 700;
    color: var(--saffron);
    margin-bottom: 12px;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
    letter-spacing: 0.5px;
  }

  .tilt-card-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.95);
    line-height: 1.6;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  /* SOUP ITEMS WITH DROPDOWN IMAGES */
  .soup-items-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: 24px;
  }

  .soup-item-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 20px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .soup-item-wrapper:hover {
    background: rgba(245, 155, 10, 0.03);
    padding: 20px 12px;
    padding-bottom: 0;
    margin: 0 -12px;
  }

  .soup-item-wrapper:last-child {
    border-bottom: none;
  }

  .soup-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
  }

  .soup-item .menu-item-name {
    font-size: 16px;
    color: var(--charcoal);
    font-weight: 600;
    flex: 1;
  }

  .soup-item .menu-item-price {
    color: var(--saffron);
    font-weight: 700;
    white-space: nowrap;
    margin-left: 16px;
    font-size: 16px;
  }

  .soup-image-container {
    position: relative;
    width: 100%;
    height: 0;
    border-radius: 12px;
    overflow: hidden;
    opacity: 0;
    transform: perspective(1200px) scaleY(0);
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    transform-origin: top;
    transform-style: preserve-3d;
    margin-top: 0;
    box-shadow: 0 0 0 0 rgba(245, 155, 10, 0);
  }

  .soup-image-container.visible {
    height: 240px;
    opacity: 1;
    transform: perspective(1200px) scaleY(1) rotateX(0deg) rotateY(0deg);
    margin-top: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease, transform 0.04s linear;
  }

  .soup-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.06s linear;
    transform-style: preserve-3d;
    will-change: transform, filter;
    filter: brightness(1);
  }

  .soup-image-container.visible:hover .soup-image {
    filter: brightness(1.05);
  }

  .soup-image-description {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(26,20,16,0.95), transparent);
    color: var(--saffron);
    padding: 20px 16px 16px;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    letter-spacing: 0.5px;
  }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    nav { padding: 14px 24px; }
    .nav-links { gap: 20px; font-size: 11px; }
    .social-nav { margin-left: 0; }
    section { padding: 80px 24px; }
    .hero { padding: 80px 24px 120px; }
    .about-layout,
    .location-grid,
    .pdf-menu-container { 
      grid-template-columns: 1fr; 
      gap: 48px;
    }
    .form-row { grid-template-columns: 1fr; }
    .footer-content { grid-template-columns: 1fr; }
    .tilt-gallery-container { 
      grid-template-columns: 1fr; 
      gap: 32px;
      margin-top: 40px;
    }
    .tilt-card { height: 360px; }
    .gallery-tilt-section { padding: 60px 24px; }
    .soup-item-wrapper { 
      grid-template-columns: 1fr; 
      gap: 20px;
    }
    .soup-image-container.visible {
      height: 180px;
    }
  }

  .fade-in {
    opacity: 0;
    animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
  }

  @keyframes fadeUp {
    to { opacity: 1; }
  }
`;

// Complete Menu Data
const completeMenu = {
  soups: [
    { name: 'Veg Soup', price: '69', image: '/images/Veg soup.png', description: 'Clear, fresh, vibrant vegetable goodness' },
    { name: 'Veg Corn Soup', price: '69', image: '/images/Veg corn soup.png', description: 'Creamy, golden, sweet corn delight' },
    { name: 'Chicken Soup', price: '89', image: '/images/Chicken soup.png', description: 'Clear, tender, aromatic chicken comfort' },
    { name: 'Ginger Chicken Soup', price: '99', image: '/images/Ginger chicken soup.png', description: 'Spiced, aromatic, warming ginger essence' },
    { name: 'Garlic Chicken Soup', price: '99', image: '/images/Garlic chicken soup.png', description: 'Rich, golden, aromatic garlic treasure' },
  ],
  vegStarters: [
    { name: 'Veg Manchuria', price: '129' },
    { name: 'Crispy Corn', price: '129' },
    { name: 'Chilli Veg', price: '139' },
    { name: 'Paneer Majestic', price: '269' },
    { name: 'Chilli Paneer', price: '199' },
    { name: 'Chilli Mushroom', price: '199' },
    { name: 'Mushroom 65', price: '199' },
    { name: 'Mushroom Manchuria', price: '199' },
  ],
  nonVegStarters: [
    { name: 'Chicken 65', price: '179' },
    { name: 'Chilli Chicken', price: '179' },
    { name: 'Ginger Chicken', price: '179' },
    { name: 'Lemon Chicken', price: '179' },
    { name: 'Chicken NOF Garlic', price: '179' },
    { name: 'Chicken Majestic', price: '229' },
    { name: 'Chilli Lollipop', price: '199' },
    { name: 'Dragon Chicken', price: '199' },
    { name: 'Chicken Manchuria', price: '189' },
  ],
  vegFriedRice: [
    { name: 'Veg Fried Rice', price: '99' },
    { name: 'Veg Ginger Fried Rice', price: '129' },
    { name: 'Veg Schezwan Fried Rice', price: '129' },
    { name: 'Veg Manchuria Fried Rice', price: '129' },
    { name: 'Mixed Veg Fried Rice', price: '159' },
    { name: 'Chilli Paneer Fried Rice', price: '159' },
    { name: 'Paneer Ginger Fried Rice', price: '159' },
    { name: 'Chilli Mushroom Fried Rice', price: '169' },
  ],
  vegNoodles: [
    { name: 'Veg Noodles', price: '99' },
    { name: 'Veg Manchurian Noodles', price: '129' },
    { name: 'Veg Schezwan Noodles', price: '129' },
    { name: 'Paneer Punch Noodles', price: '149' },
    { name: 'Mushroom Noodles', price: '169' },
  ],
  eggRiceNoodles: [
    { name: 'Egg Soft Noodles', price: '129' },
    { name: 'Egg Fried Rice', price: '129' },
    { name: 'Egg Shezwan Noodles', price: '139' },
    { name: 'Egg Shezwan Rice', price: '139' },
    { name: 'Spl Egg Noodles', price: '149' },
    { name: 'Spl Egg Fried Rice', price: '149' },
    { name: 'Chicken Soft Noodles', price: '149' },
    { name: 'Chicken Fried Rice', price: '149' },
    { name: 'Egg Paneer Noodles', price: '159' },
    { name: 'Egg Paneer Rice', price: '159' },
    { name: 'Chicken Ginger Noodles', price: '159' },
    { name: 'Chicken Schezwan Noodles', price: '159' },
    { name: 'Chicken Fry Piece Fried Rice', price: '169' },
    { name: 'Chicken Schezwan Fried Rice', price: '169' },
    { name: 'Egg Ginger Noodles', price: '159' },
    { name: 'Egg Ginger Rice', price: '159' },
    { name: 'Mixed Non-Veg Fried Rice', price: '249' },
    { name: 'Chicken Lollipop Fried Rice', price: '229' },
  ],
  nonVegBiryanis: [
    { name: 'Chicken Dum Biryani', price: '179' },
    { name: 'Chicken Fry Piece Biryani', price: '179' },
    { name: 'Spl Chicken Biryani', price: '229' },
    { name: 'Chicken Lollipop Biryani', price: '229' },
    { name: 'Mughlai Chicken Biryani', price: '249' },
    { name: 'Mutton Biryani', price: '299' },
  ],
  vegBiryanis: [
    { name: 'Veg Biryani', price: '149' },
    { name: 'Spl Veg Biryani', price: '169' },
    { name: 'Paneer Biryani', price: '219' },
    { name: 'Mushroom Biryani', price: '249' },
  ],
  familyPacks: [
    { name: 'Chicken Dum Biryani Family Pack', price: '499' },
    { name: 'Chicken Fry Piece Biryani Family Pack', price: '499' },
    { name: 'Veg Biryani Family Pack', price: '449' },
    { name: 'Spl Chicken Biryani Family Pack', price: '599' },
    { name: 'Chicken Lollipop Biryani Family Pack', price: '599' },
    { name: 'Mughlai Chicken Biryani Family Pack', price: '649' },
    { name: 'Mutton Biryani Family Pack', price: '799' },
  ],
};

const SoupMenuItem = ({ item, idx }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current || !isHovered) return;
    const rect = containerRef.current.querySelector('.soup-image-container')?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (centerX - e.clientX) / 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={containerRef}
      className="soup-item-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="soup-item">
        <div className="menu-item-name">{item.name}</div>
        <div className="menu-item-price">₹{item.price}</div>
      </div>
      <div className={`soup-image-container ${isHovered ? 'visible' : ''}`}
        style={isHovered ? {
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
        } : {}}>
        <img src={item.image} alt={item.name} className="soup-image" />
        <div className="soup-image-description">{item.description}</div>
      </div>
    </div>
  );
}

const MenuCategory = ({ title, items, isSoups }) => {
  if (isSoups) {
    return (
      <div className="menu-category">
        <h3 className="menu-category-title">{title}</h3>
        <div className="soup-items-grid">
          {items.map((item, idx) => (
            <SoupMenuItem key={idx} item={item} idx={idx} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="menu-category">
      <h3 className="menu-category-title">{title}</h3>
      <div className="menu-items-grid">
        {items.map((item, idx) => (
          <div key={idx} className="menu-item">
            <div className="menu-item-name">{item.name}</div>
            <div className="menu-item-price">₹{item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const featuredDishes = [
  { id: 1, name: 'Biryani Special', description: 'Fragrant basmati rice layered with tender meat, aromatic spices, and slow-cooked to perfection', image: '/images/1.jpg' },
  { id: 2, name: 'Paneer Majestic', description: 'Premium cottage cheese cubes in a rich, creamy sauce with perfect blend of spices', image: '/images/2.jpg' },
  { id: 3, name: 'Chicken 65', description: 'Crispy, fiery chicken appetizer coated in aromatic flakes and fresh green chilies', image: '/images/3.jpg' },
  { id: 4, name: 'Hakka Noodles', description: 'Perfectly wok-tossed noodles with fresh vegetables and authentic Chinese flavors', image: '/images/4.jpg' },
  { id: 5, name: 'Family Feast', description: 'Complete meal combo with biryani, starters, noodles, and traditional side dishes', image: '/images/5.jpg' },
  { id: 6, name: 'Chef\'s Selection', description: 'Seasonal delicacies and signature dishes curated by our master chef daily', image: '/images/6.jpg' },
  { id: 7, name: 'Dinner Delight', description: 'Premium platter featuring the best of Indian, Chinese, and fusion cuisine', image: '/images/7.jpg' },
];

const ReviewCard = ({ review }) => {
  return (
    <div className={`review-card ${review.isNew ? 'new' : ''}`}>
      <div className="review-header">
        <div className="review-author-info">
          <div className="review-author-name">
            {review.author}
            {review.isLocalGuide && <span className="local-guide-badge">Local Guide</span>}
          </div>
          <div className="review-meta">
            <div className="review-meta-item">
              <span>📝</span>
              <span>{review.reviewCount} review{review.reviewCount !== 1 ? 's' : ''}</span>
            </div>
            {review.photos && (
              <div className="review-meta-item">
                <span>📷</span>
                <span>{review.photos}</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="review-stars">{'⭐'.repeat(review.rating)}</div>
          {review.isNew && <span className="new-badge">New</span>}
        </div>
      </div>

      <div className="review-text">"{review.reviewText}"</div>

      <div className="owner-response-section">
        <div className="owner-response-label">The Panchi House</div>
        <div className="owner-response-text">{review.ownerResponse}</div>
        <div className="owner-response-time">{review.ownerResponseTime}</div>
      </div>
    </div>
  );
};

const CardTilt = ({ dish, index }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current || !isVisible) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerY = window.innerHeight / 2;
      const distFromCenter = rect.top - centerY;
      const scrollProgress = -distFromCenter / (window.innerHeight / 2);
      
      setTilt({
        x: -scrollProgress * 12,
        y: (Math.random() - 0.5) * 8,
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <div
      ref={cardRef}
      className="tilt-card"
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotateZ(0deg) scale(${1 + Math.abs(tilt.x) * 0.002})`,
        opacity: isVisible ? 1 : 0.3,
      }}
    >
      <div className="tilt-card-inner">
        <img src={dish.image} alt={dish.name} className="tilt-card-image" />
        <div className="tilt-card-overlay"></div>
        <div className="tilt-card-content">
          <h3 className="tilt-card-title">{dish.name}</h3>
          <p className="tilt-card-desc">{dish.description}</p>
        </div>
      </div>
    </div>
  );
};

const reviews = [
  {
    id: 1,
    author: "Indira Parla",
    reviewCount: 3,
    photos: 2,
    rating: 5,
    timeAgo: "a month ago",
    reviewText: "Had biryani and noodles at Thepanchihouse and honestly, the quality is premium! Perfect aroma, rich taste. Totally worth it!",
    ownerResponse: "Thank you so much ❤️ Your words truly mean a lot to us. This journey wouldn't feel as special without the love and support from amazing people like you. Dreams feel more beautiful when people like you cheer for them ❤️ Can't wait to see you tomorrow 🤗✨",
    ownerResponseTime: "a month ago"
  },
  {
    id: 2,
    author: "Devi K",
    reviewCount: 3,
    rating: 5,
    timeAgo: "a month ago",
    reviewText: "Panchi house amazing place, with wonderful ambience, food was too good .keep rocking guys ,keep up your smart work 👏 👌 🙌",
    ownerResponse: "Thank you so much ❤️ Your words truly mean a lot to us. This journey wouldn't feel as special without the love and support from amazing people like you. Can't wait to see you tomorrow 🤗✨",
    ownerResponseTime: "a month ago"
  },
  {
    id: 3,
    author: "Sandhya Thalluri Thalluri (Rani)",
    reviewCount: 1,
    rating: 5,
    timeAgo: "a month ago",
    reviewText: "Very good ambiance and well served. Must try place 👍",
    ownerResponse: "Thank youu ❤️ Now you have to come tomorrow — special guest treatment guaranteed 😎☕",
    ownerResponseTime: "a month ago"
  },
  {
    id: 4,
    author: "thalluri sangeetha",
    reviewCount: 3,
    rating: 5,
    timeAgo: "a month ago",
    reviewText: "Best place to visit guys🤗",
    ownerResponse: "Hi Thalluri Sangeetha thank you so much for the 5-star love! We are thrilled you enjoyed your experience at The Panchi House. Our team works hard to make every visit special, and knowing we hit the mark for you makes our day. Can't wait to have you back for another round of your favorites!",
    ownerResponseTime: "a month ago"
  },
  {
    id: 5,
    author: "Shravya Singaravelu",
    reviewCount: 1,
    rating: 5,
    timeAgo: "a month ago",
    reviewText: "Lunch - The food was really amazing",
    ownerResponse: "Thank you for your wonderful review! We're delighted you enjoyed your experience at The Panchi House. Your support means a lot to us, and we look forward to serving you again soon. 😊",
    ownerResponseTime: "a month ago"
  },
  {
    id: 6,
    author: "Himanish Gandhe",
    reviewCount: 2,
    photos: 1,
    rating: 5,
    timeAgo: "3 days ago",
    isNew: true,
    reviewText: "Amazing food and gud place to chill environment is very nice and the teddy is like wow❤️❤️",
    ownerResponse: "Hi Himanish, thank you so much for the 5-star review! We are thrilled to hear you enjoyed the food and found our place a good spot to chill. Our giant teddy bear is definitely a fan favorite—he'll be happy to know he made your visit special! Hope to see you again soon at The Panchi House.",
    ownerResponseTime: "3 days ago"
  },
  {
    id: 7,
    author: "Sweta Prasad",
    reviewCount: 1,
    rating: 5,
    timeAgo: "5 days ago",
    isNew: true,
    reviewText: "The food was really tasty and fresh. I enjoyed the experience. Nice people with good service and friendly staff. The ambience was calm and perfect for the family time.",
    ownerResponse: "Thank you so much for your kind and detailed review, Sweta! We're delighted to hear that you enjoyed our food and found the atmosphere perfect for family time. Our team works hard to provide quick service and a clean environment, so your feedback means a lot to us. We look forward to welcoming you and your family back soon!",
    ownerResponseTime: "5 days ago"
  },
  {
    id: 8,
    author: "Koigura Bhagya",
    reviewCount: 1,
    rating: 5,
    timeAgo: "5 days ago",
    isNew: true,
    reviewText: "The panchi house has good ambiance and great food",
    ownerResponse: "Hi Bhagya! Thank you so much for the 5-star rating! We are thrilled to hear you enjoyed the ambiance and the food. It was a pleasure serving you, and we look forward to seeing you again soon!",
    ownerResponseTime: "5 days ago"
  },
  {
    id: 9,
    author: "Mangamma Uppala",
    reviewCount: 1,
    rating: 5,
    timeAgo: "5 days ago",
    isNew: true,
    reviewText: "Biryani was too good.",
    ownerResponse: "Hi Mangamma Uppala! We are thrilled to hear you enjoyed the Our Biryani which is one of our Signature Dish. Thank you so much for the 5-star rating! It was a pleasure serving you, and we look forward to seeing you again soon!",
    ownerResponseTime: "5 days ago"
  },
  {
    id: 10,
    author: "Sathwik Thotapally",
    reviewCount: 1,
    photos: 5,
    rating: 5,
    timeAgo: "a week ago",
    isNew: true,
    reviewText: "Visited this place for my friend's birthday party. The taste was just more than excellent. Both veg and non veg stood out. The ambience was so nice and we had a great time. The food's taste just takes over everything. Biryani is highly recommended!",
    ownerResponse: "Hi Sathwik, thank you so much for the 5-star rating! We are thrilled to hear that you enjoyed the birthday celebrations and that our Biryani—both veg and non-veg—lived up to your expectations. It was a pleasure hosting you & your friends, and we're glad you liked the transformation of our space. Looking forward to seeing you and your friends again soon!",
    ownerResponseTime: "a week ago"
  },
  {
    id: 11,
    author: "Danda Hema Latha",
    reviewCount: 3,
    rating: 5,
    timeAgo: "a week ago",
    isNew: true,
    reviewText: "Food is clean and hygiene, tasty, decent environment, good staff, highly recommended",
    ownerResponse: "Thank you so much for the 5-star rating, Danda Hema Latha! We are thrilled to hear that you enjoyed the food and found our environment and staff to your liking. Maintaining high hygiene standards is a top priority for us, so your feedback means a lot. We look forward to serving you again soon!",
    ownerResponseTime: "a week ago"
  },
  {
    id: 12,
    author: "Tejaswi Mahalaxmi",
    reviewCount: 1,
    rating: 5,
    timeAgo: "a week ago",
    isNew: true,
    reviewText: "The feeling of being at home is always there. I had a good overall experience. I love the swing out there and the teddys. Must visit",
    ownerResponse: "Hi Tejaswi Mahalaxmi, thank you for such a heartwarming review! We're so happy we could give you that 'feeling of being at home'—that is exactly what we strive for at The Panchi House. We'll be sure to tell our teddy bears (and the swing!) that they have a new fan. We can't wait to welcome you back for another cozy lunch soon!",
    ownerResponseTime: "a week ago"
  },
  {
    id: 13,
    author: "prashanth pola",
    reviewCount: 30,
    isLocalGuide: true,
    photos: 9,
    rating: 5,
    timeAgo: "a week ago",
    isNew: true,
    reviewText: "A place where you get delicious food under budget with great hospitality. Thank you panchi house.",
    ownerResponse: "Wow, thank you for the 5-star rating! We're so glad you loved the food and our hospitality. We can't wait to serve you again soon!",
    ownerResponseTime: "a week ago"
  },
  {
    id: 14,
    author: "VJammikuntla",
    reviewCount: 4,
    rating: 5,
    timeAgo: "a week ago",
    isNew: true,
    reviewText: "The Panchi House Bistro is one of the best Resto in Ecil for Biryanis and Chinese. Biryanis are flavourful along with quality and quantity. Friendly staff and good service is all a customer need in hunger. Thanks and all the best to Panchi House!",
    ownerResponse: "Hi VJammikuntla, thank you so much for the fantastic 5-star review! We are thrilled to hear you enjoyed our Biryani and Chinese dishes. Our team works hard to provide both great food and friendly service, so your kind words mean a lot to us. We look forward to serving you again at The Panchi House soon!",
    ownerResponseTime: "a week ago"
  },
  {
    id: 15,
    author: "Ghatta Pavan",
    reviewCount: 7,
    rating: 5,
    timeAgo: "a week ago",
    isNew: true,
    reviewText: "Had the Fry Piece Biryani here and it was excellent! The chicken was perfectly spiced and crispy, and the rice was incredibly flavorful. Definitely worth a visit if you're a biryani lover.",
    ownerResponse: "Wow, thank you for the 5-star rating! We're so glad you loved the Fry Piece Biryani—it's definitely a favorite here. We can't wait to serve you again soon!",
    ownerResponseTime: "a week ago"
  },
  {
    id: 16,
    author: "globe tv",
    reviewCount: 1,
    rating: 5,
    timeAgo: "a week ago",
    isNew: true,
    reviewText: "I love it, the food is simply good enjoyed",
    ownerResponse: "Thank you for the review! We're so glad to hear you enjoyed the food and had a good dinner with us. We appreciate the feedback on our service and atmosphere as well—we are always working to make the experience even better. Looking forward to serving you again soon!",
    ownerResponseTime: "a week ago"
  },
  {
    id: 17,
    author: "Arun Goud",
    reviewCount: 3,
    rating: 5,
    timeAgo: "a week ago",
    isNew: true,
    reviewText: "Had a wonderful experience with food and service",
    ownerResponse: "Thank you so much for the 5-star rating, Arun! It's wonderful to know you had a great experience with our food and service. Your support means a lot to us, and we hope to see you back again very soon!",
    ownerResponseTime: "a week ago"
  },
  {
    id: 18,
    author: "Mithin",
    reviewCount: 2,
    rating: 5,
    timeAgo: "2 weeks ago",
    reviewText: "Good ambience and good service. And to make a note the food is delicious and at affordable prices.",
    ownerResponse: "Thank you so much. Your words truly mean a lot to us. This journey wouldn't feel as special without the love and support from amazing people like you.",
    ownerResponseTime: "2 weeks ago"
  },
  {
    id: 19,
    author: "VARUN BATTERY CARE",
    reviewCount: 4,
    isLocalGuide: true,
    photos: 13,
    rating: 5,
    timeAgo: "a month ago",
    reviewText: "Great food and excellent service!",
    ownerResponse: "Thank you for 5 star rating. We are glad you enjoyed our food & service. We suggest you to try out most loved dishes - mughlai chicken biryani, fry piece biryani, lemon chicken starter from Panchi House. Love to see you soon sir.😊",
    ownerResponseTime: "2 weeks ago"
  }
];

export default function PanchiHouse() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#" className="nav-brand">🍽️ The Panchi House</a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#highlights">Features</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#location">Location</a></li>
          <li><a href="#contact">Contact</a></li>
          <li className="social-nav">
            <a href="https://www.instagram.com/thepanchihouse/" target="_blank" rel="noopener noreferrer" title="Follow on Instagram"><i className="fab fa-instagram"></i></a>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Taste the <span className="hero-italic">Magic</span>
          </h1>
          <p className="hero-sub">
            Authentic biryanis, delicious Chinese cuisine, and an experience beyond compare. Welcome to Panchi House, where tradition meets exceptional taste in the heart of ECIL, Secunderabad.
          </p>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-primary">Reserve a Table</a>
            <a href="#menu" className="btn btn-secondary">Explore Menu</a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="section-label fade-in">Our Story</div>
        <h2 className="section-title fade-in">Welcome to <span className="hero-italic">Panchi House</span></h2>
        <div className="about-layout fade-in">
          <div className="about-text">
            <h3>A Home Away From Home</h3>
            <p>Panchi House is more than just a restaurant – it's a celebration of culinary excellence and warm hospitality. Nestled in Royal Residency, Kamalanagar, we've created a space where families, friends, and colleagues gather to share moments of joy.</p>
            <p>Our kitchen is dedicated to preparing authentic biryanis using premium basmati rice, aromatic spices sourced directly, and time-honored recipes passed down through generations. Every dish tells a story.</p>
            <p>With our unique ambiance, including our famous giant teddy bear and swing seating, we create memories that last beyond just meals. Whether it's a casual dinner, a celebration, or a private event – Panchi House makes it special.</p>
            
            <div className="features-grid">
              <div className="feature-box">
                <strong>5.0⭐ Rating</strong>
                <p>28 genuine Google reviews from our valued customers</p>
              </div>
              <div className="feature-box">
                <strong>📍 Prime Location</strong>
                <p>Royal Residency, Kamalanagar, ECIL, Secunderabad</p>
              </div>
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(232, 155, 60, 0.12) 0%, rgba(200, 90, 23, 0.08) 100%)',
            borderRadius: '12px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '400px'
          }}>
            <div style={{fontSize: '80px', marginBottom: '20px'}}>🍽️🐻✨</div>
            <p style={{fontSize: '18px', color: 'var(--gold-dark)', fontWeight: '600'}}>Where food meets magic and memories are made</p>
          </div>
        </div>
      </section>



      {/* MENU */}
      <section className="menu-section" id="menu">
        <div className="section-label fade-in">Culinary Journey</div>
        <h2 className="section-title fade-in">Complete <span className="hero-italic">Menu</span></h2>
        
        <div className="menu-container fade-in">
          <MenuCategory title="🍲 Soups" items={completeMenu.soups} isSoups={true} />
          <MenuCategory title="🥘 Veg Starters" items={completeMenu.vegStarters} />
          <MenuCategory title="🍗 Non Veg Starters" items={completeMenu.nonVegStarters} />
          <MenuCategory title="🍚 Veg Fried Rice" items={completeMenu.vegFriedRice} />
          <MenuCategory title="🍝 Veg Hakka Noodles" items={completeMenu.vegNoodles} />
          <MenuCategory title="🥚 Egg & Chicken Rice/Noodles" items={completeMenu.eggRiceNoodles} />
          <MenuCategory title="🐔 Non-Veg Biryanis" items={completeMenu.nonVegBiryanis} />
          <MenuCategory title="🌾 Veg Biryanis" items={completeMenu.vegBiryanis} />
          <MenuCategory title="👨‍👩‍👧‍👦 Family Packs" items={completeMenu.familyPacks} />
        </div>
      </section>

      {/* FEATURED DISHES - 3D TILT GALLERY */}
      <section className="gallery-tilt-section" id="gallery">
        <div className="section-label fade-in">Visual Experience</div>
        <h2 className="section-title fade-in">Featured <span className="hero-italic">Dishes</span></h2>
        <div className="tilt-gallery-container">
          {featuredDishes.map((dish, idx) => (
            <CardTilt key={dish.id} dish={dish} index={idx} />
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="highlights-section" id="highlights">
        <div className="section-label fade-in">Why Choose Us</div>
        <h2 className="section-title fade-in">Special <span className="hero-italic">Features</span></h2>
        <div className="highlights-grid fade-in">
          <div className="highlight-card">
            <div className="highlight-icon">🐻</div>
            <h4>Giant Teddy Bear</h4>
            <p>Our famous fuzzy friend creates magical moments for kids and makes every visit unforgettable and Instagram-worthy</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">🎪</div>
            <h4>Swing Seating</h4>
            <p>Dine on our unique swing seats – a fun, interactive experience that makes your meal unforgettable</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">👨‍🍳</div>
            <h4>Authentic Recipes</h4>
            <p>Traditional cooking techniques with premium ingredients and time-honored recipes ensure authentic taste</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">🎂</div>
            <h4>Event Hosting</h4>
            <p>Perfect venue for birthdays, celebrations, and private events. Customized catering and packages available</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">✨</div>
            <h4>Great Ambiance</h4>
            <p>Warm, welcoming atmosphere with modern touches and elegant decor creating the perfect dining scene</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">👥</div>
            <h4>Friendly Staff</h4>
            <p>Our attentive, trained team ensures every guest feels valued and well-cared-for throughout their visit</p>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="testimonials-section fade-in" id="reviews">
        <div className="section-label" style={{color: 'var(--saffron)'}}>Customer Testimonials</div>
        <h2 className="section-title" style={{color: 'white'}}>Loved by <span className="hero-italic" style={{color: 'var(--saffron)'}}>1000+ Guests</span></h2>
        <div style={{textAlign: 'center', marginBottom: '48px', color: 'rgba(255,255,255,0.8)'}}>
          <p style={{fontSize: '16px'}}>5.0 ⭐ Rating with 28+ Genuine Google Reviews</p>
        </div>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section className="location-section" id="location">
        <div className="section-label fade-in">Find Us</div>
        <h2 className="section-title fade-in"><span className="hero-italic">Location</span> & Hours</h2>
        <div className="location-grid fade-in">
          <div className="location-info">
            <h3>The Panchi House</h3>
            
            <div className="location-item">
              <div className="location-label">📍 Address</div>
              <div className="location-value">
                Royal Residency, Kamalanagar<br/>
                MJ Colony, Moula Ali<br/>
                Secunderabad, Telangana 500040
              </div>
            </div>

            <div className="location-item">
              <div className="location-label">🕐 Opening Hours</div>
              <div className="location-value">
                Daily: 12:00 PM - 11:00 PM<br/>
                Open on all holidays
              </div>
            </div>

            <div className="location-item">
              <div className="location-label">📱 Follow Us</div>
              <div className="location-value">
                <a href="https://www.instagram.com/thepanchihouse/" target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent)', textDecoration: 'none', fontWeight: '600'}}>
                  @thepanchihouse on Instagram
                </a>
              </div>
            </div>

            <div className="location-item">
              <div className="location-label">🎉 Services</div>
              <div className="location-value">
                ✓ Dine-in<br/>
                ✓ Private Dining<br/>
                ✓ Birthday Events<br/>
                ✓ Catering<br/>
                ✓ Takeaway
              </div>
            </div>
          </div>

          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3809.389444!2d78.51023!3d17.38514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb34f7d2f2f2f%3A0x5c5c5c5c5c5c5c5c!2sRoyal%20Residency%2C%20Kamalanagar%2C%20Secunderabad!5e0!3m2!1sen!2sin!4v1716115800000"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="section-label">Get in Touch</div>
        <h2 className="section-title">Book Your <span className="hero-italic">Table</span></h2>
        <div className="contact-content">
          <form className="contact-form" onSubmit={e => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="your@email.com" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+91 98076 12345" required />
              </div>
              <div className="form-group">
                <label>Date & Time</label>
                <input type="datetime-local" required />
              </div>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Tell us about your reservation, special occasions, or catering needs..." required></textarea>
            </div>
            <button type="submit" className="form-submit">Send Reservation Request</button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h4>The Panchi House</h4>
            <p>Authentic biryanis, delicious Chinese cuisine, and unforgettable dining moments.</p>
            <div className="footer-social">
              <a href="https://www.instagram.com/thepanchihouse/" target="_blank" rel="noopener noreferrer" title="Follow on Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://www.google.com/maps/search/Panchi+House+Secunderabad" target="_blank" rel="noopener noreferrer" title="Google Maps">📍</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#about">About Us</a>
            <a href="#menu">Menu</a>
            <a href="#gallery">Gallery</a>
            <a href="#highlights">Features</a>
            <a href="#location">Location</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-section">
            <h4>Opening Hours</h4>
            <p><strong>12:00 PM - 11:00 PM</strong></p>
            <p>Open daily including holidays</p>
            <p style={{marginTop: '12px', fontSize: '12px', color: 'var(--text-light)'}}>
              Perfect for casual dinners, celebrations, and events
            </p>
          </div>
          <div className="footer-section">
            <h4>Location</h4>
            <p>Royal Residency, Kamalanagar, MJ Colony, Moula Ali, Secunderabad, Telangana 500040</p>
            <p style={{marginTop: '12px'}}>
              <a href="https://www.google.com/maps/search/Royal+Residency+Kamalanagar+Secunderabad" target="_blank" rel="noopener noreferrer">
                Get Directions →
              </a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 The Panchi House. All rights reserved. | Follow us <a href="https://www.instagram.com/thepanchihouse/" target="_blank" rel="noopener noreferrer">@thepanchihouse</a> | Designed with ❤️ for great food & memories</p>
        </div>
      </footer>
    </>
  );
}
