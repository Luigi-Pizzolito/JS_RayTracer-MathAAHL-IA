import { Vec3/*, Point3, Color*/, rand_v, rand_range_v } from './vec3.js';
import Ray from './ray.js';

export default class Camera {
    constructor() {
        this.viewportHeight = 2
        this.viewportWidth = 4//this.viewportHeight * (16 / 9)
        this.focalLength = 1
        this.origin = new Vec3(0, 0, 0)
        this.horizontal = new Vec3(this.viewportWidth, 0, 0)
        this.vertical = new Vec3(0, -this.viewportHeight, 0)
        this.lowerLeftCorner = this.origin.subtract(this.horizontal.divide(2)).subtract(this.vertical.divide(2)).add(new Vec3(0, 0, this.focalLength))
    }

    get_ray(u, v) {
        return new Ray(this.origin, this.lowerLeftCorner.add(this.horizontal.scale(u).add(this.vertical.scale(v).add(this.origin))))
    }
}