// ---------- Import Modules ----------
import { ImgDrawer } from './classes/imgdraw.js'
import { Vec3/*, Point3, Color*/, rand_v, rand_range_v, random_in_unit_sphere } from './classes/vec3.js';
import { rand, rand_range } from './classes/random.js';
import Ray from './classes/ray.js';
import Camera from './classes/camera.js';
import Sphere from './classes/sphere.js'
console.log("JS Ray Tracer V1.0")

// ---------- Setup image canvas ----------
const height = 2000//1080
const width = 4000 //height * (16 / 9)
var img = new ImgDrawer(height, width)

//---------- Setup Virtual Scene ----------
var cam = new Camera()

var worldElements = []
// worldElements.push(new Sphere(new Vec3(-0.2, -0, 0.8), 0.15)) 
// worldElements.push(new Sphere(new Vec3(0.6, 0.5, 0.7), 0.25))
// worldElements.push(new Sphere(new Vec3(-0.4, -0.2, 0.5), 0.1)) 

// worldElements.push(new Sphere(new Vec3(0.2, -0.2, 0.5), 0.1)) //center and radius
// worldElements.push(new Sphere(new Vec3(0, 0, 1), 0.5))
// worldElements.push(new Sphere(new Vec3(0, -150.5, -1), 150))


// worldElements.push(new Sphere(new Vec3(-2.5, 1, 2), 0.45)) 

for (let index = 0; index < 250; index++) {
    worldElements.push(new Sphere(new Vec3(((Math.random() * 2) - 1) * 2, ((Math.random() * 2) - 1) * 1, ((Math.random())) * 2), Math.random() / 4))
}

// let uz = 0.220
// let vz = 0.380
// let ray = cam.get_ray(uz, vz)
// console.log(rayz.direction)


// ---------- Render Image Rays ----------
//iterate over rows
console.log("Rendering... ")
var pixSamples = 10 //samples to collect per pixel

for (let y = 0; y < height; y++) {
    //iterate over columns
    for (let x = 0; x < width; x++) {
        //iterate over every pixel

        // -------- Create Stand-In Gradient Background ----------
        // gradient from ray y coordinate
        let topcol = new Vec3(192, 32, 255)
        let btmcol = new Vec3(0, 0, 0)

        let u = (x) / (width - 1)
        let v = (y) / (height - 1)
        let ray = cam.get_ray(u, v)

        let gradientFactor = /*y/(height-1)*/ (ray.direction.y + 1) / 2
        var gradient = btmcol.scale(gradientFactor).add(topcol.scale(1 - gradientFactor)).round().scale(pixSamples)
        var colour = gradient

        // ---------- iterate to collect each ray sample ----------
        for (let s = 0; s < pixSamples; s++) {
            // ---------- Scale X & Y Coordinates to Cast Rays at Pixels w/ random samples ----------
            let u = (x + Math.random()) / (width - 1)
            let v = (y + Math.random()) / (height - 1)
            let ray = cam.get_ray(u, v)

            // ---------- iterate over all world elements and check for ray intersections ----------
            // ---------- then cast rays to determine pixel colour, repeat and average samples ----------
            var nearesthit = 1e6
            for (let i = 0; i < worldElements.length; i++) {
                colour = colour.add(ray_colour(worldElements[i], ray, (s > 0)))
            }
        }

        //draw pixel

        colour = colour.divide(pixSamples).round();
        img.setPixel(x, y, colour)

        // console.log(colour.add(gradient))
        // process.exit()
        // if ((x==(5-1)) && (y==((height-(20+1))))) {
        //     img.setPixel(x,y, new Vec3(0, 0, 255))
        //     console.log(ray);
        // } else if ((x==(40-1)) && (y==((height-(5))))) {
        //     img.setPixel(x,y, new Vec3(0, 0, 255))
        //     console.log(ray);
        // }  else
        // if ((x==(30-1)) && (y==((height-(10))))) {
        //     img.setPixel(x,y, new Vec3(0, 0, 255))
        //     console.log(ray);
        // }
        // if ((x==(22-1)) && (y==((height-(19))))) {
        //         img.setPixel(x,y, new Vec3(0, 0, 255))
        //         console.log(ray);
        //     }
    }
    //update progress to console
    img.bar.tick()
}

function ray_colour(ball, ray, sca, x, y) {
    let t = ball.hit(ray)
    if (t > 0) {
        // ray intersects with the ball

        // ---------- Calculate Surface colourrmal ----------
        let N = ray.at(t).subtract(ball.center).normalize()
        //check if ray is comming in or out of the surface by comparing to the normal, normals are inverted if the ray is coming from inside an object
        N = (ray.direction.dot(N) < 0) ? N : N.scale(-1)
        N.z = -N.z
        // if ((x==(30-1)) && (y==((height-(10))))) {
        //     console.log(N);
        // }

        // shade by  mapping normalised surface normal to R, G, B
        // only draw on top if it is closer
        if (t < nearesthit) {
            nearesthit = t;
            let outcol = new Vec3(255 * ((N.x + 1) / 2), 255 * ((N.y + 1) / 2), 255 * ((N.z + 1) / 2)).round()
            // var childRay = new Ray(ray.at(t), ray.at(t).add(N).add(random_in_unit_sphere()).subtract(ray.at(t)));
            // for (let i = 0; i < worldElements.length; i++) {
            //     let outcol = ray_colour(worldElements[i], ray, false).scale(255/2)
            // }
            // let outcol = ray_colour(ball, childRay, false).scale(255/2)
            // return new Vec3(255, 0, 0).subtract(gradient)
            return sca ? outcol : outcol.subtract(gradient) //if hit then return normal color
        } else {
            // return sca ? new Vec3(255, 0, 0) : new Vec3(255, 0, 0).subtract(gradient)
            return new Vec3(0, 0, 0)
        }
    } else {
        return new Vec3(0, 0, 0)
    }
}

// ---------- Save Image to PNG File ----------
img.writefile('./output.png');