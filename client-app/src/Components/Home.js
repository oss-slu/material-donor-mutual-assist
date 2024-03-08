import React from 'react'


export default function Home() {
  return (
    <div className="bg-dark text-white p-5">
      <div className="row">
        <div className="col-md-6">
          <h1 className="display-3 fw-bold">ST. LOUIS BWORKS SHOWS LOCAL KIDS WHAT’S POSSIBLE.</h1>
          <p className="mt-4 fs-5">
            Our programs build confidence and character through educational programs rooted in teamwork and
            responsibility. We accept donations of both adult and children’s sized bicycles.
          </p>
          <div className="mt-4">
            <h2 className="fs-4 fw-bold">Quick Links:</h2>
            <ul className="list-unstyled mt-2">
              <li>
                <a className="text-decoration-none text-info" href="#">
                  Upcoming Classes & Registration.
                </a>
              </li>
              <li>
                <a className="text-decoration-none text-info" href="#">
                  Shop for Bicycles.
                </a>
              </li>
              <li>
                <a className="text-decoration-none text-info" href="#">
                  Request a Donation Acknowledgement.
                </a>
              </li>
              <li>
                <a className="text-decoration-none text-info" href="#">
                  Remote Drop Off Locations.
                </a>
              </li>
              <li>
                <a className="text-decoration-none text-info" href="#">
                  Our Hours of Operation.
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-6 position-relative">
          <img
            alt="Children learning"
            className="rounded-circle"
            height="400"
            src="/cycle.jpg"
            style={{
              aspectRatio: "400/400",
              objectFit: "cover",
            }}
            width="400"
          />
          <img
            alt="Be more"
            className="rounded-circle position-absolute bottom-0 end-0 translate-middle"
            height="200"
            src="/image.jpg"
            style={{
              aspectRatio: "200/200",
              objectFit: "cover",
            }}
            width="200"
          />
        </div>
      </div>
    </div>

  )
}