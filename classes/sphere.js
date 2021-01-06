export default class Sphere {
    constructor(center, radius) {
        this.center = center
        this.radius = radius
    }

    hit(r) {
        // Sphere is: (𝐏−𝐂)⋅(𝐏−𝐂) = 𝑟²
        //     where: 𝐏 = 𝐀+𝑡𝐛
        //                𝐀 = r.origin
        //                𝐛 = r.direction
        //            𝐂 = this.center

        // solve (𝐛⋅𝐛)𝑡²  +  (𝐛⋅(𝐀−𝐂))2𝑡  +  (𝐀−𝐂)⋅(𝐀−𝐂)−𝑟²  =0 to find descriminant
        // finding the discriminant gives wether there are 0, 1 or 2 intersections
        // but spares the expense of calculating where those intersections are

        // oc = (𝐀−𝐂)
        /* old algorithm
        let oc = r.origin.subtract(this.center);
        let a = r.direction.dot(r.direction);
        let b = 2 * oc.dot(r.direction);
        let c = oc.dot(oc) - this.radius * this.radius;

        let discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
            return -1.0;
        } else {
            // if there are solutions, then return the smallest one
            return (-b - Math.sqrt(discriminant)) / (2.0 * a);
        }
        */
        //optimised algorithm, substituting b = 2h
        let oc = r.origin.subtract(this.center);
        let a = r.direction.length_squared();
        let half_b = oc.dot(r.direction);
        let c = oc.length_squared() - this.radius * this.radius;

        let discriminant = half_b * half_b - a * c;
        if (discriminant < 0) {
            return -1.0;
        } else {
            // if there are solutions, then return the smallest one
            return (-half_b - Math.sqrt(discriminant)) / a;
        }
    }
}