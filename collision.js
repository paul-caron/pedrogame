function checkSquareCollision(x1, y1, w1, x2, y2, w2) {
    // Calculate the half-widths
    const halfWidth1 = w1 / 2;
    const halfWidth2 = w2 / 2;
    
    // Check the horizontal overlap
    const horizontalOverlap = Math.abs(x1 - x2) < (halfWidth1 + halfWidth2);
    
    // Check the vertical overlap
    const verticalOverlap = Math.abs(y1 - y2) < (halfWidth1 + halfWidth2);
    
    // If both horizontal and vertical overlaps are true, the squares are colliding
    return horizontalOverlap && verticalOverlap;
}

// Example usage:
const x1 = 5, y1 = 5, w1 = 4;
const x2 = 6, y2 = 6, w2 = 4;

const isColliding = checkSquareCollision(x1, y1, w1, x2, y2, w2);

console.log(isColliding); // true if they are colliding, false if not
