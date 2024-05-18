addBass() {
    const note = this.stemAnalyzer.getBeatNote('bass');
    const hue = (note - 80) * (360 / (130 - 80)); // Map the note to a hue value between 0 and 360
    const noteColor = new THREE.Color(`hsl(${hue}, 100%, 50%)`); // Create a color using the hue

    const bassGeometry = new THREE.CylinderGeometry(0.5, 0.5, 300, 32);
    const bassMaterial = new THREE.MeshStandardMaterial({
        color: noteColor,
        emissive: noteColor,
    });
    const bass = new THREE.Mesh(bassGeometry, bassMaterial);
    bass.position.set(
        (note - 80) * 0.5 + (Math.random() - 0.5) * 3,
        0,
        180
    );

    this.stems.add(bass);
}