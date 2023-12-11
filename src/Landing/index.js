import "./index.css"
import Navigation from "../Navigation"

function Landing() {
    return (
      <div className="">
        <div className="container-fluid"> <Navigation /> </div>
        <div className="d-flex fill" style={{backgroundColor: '#FFC8D3'}}>
            <div id='bg' className="w-100 fill" style={{ backgroundImage: `url(/litreview4.png)`,
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: '100vw',
                                            height: '95vh',
                                        }}>
            </div>
        </div>
        <div className="row w-100" style={{height: '50vh'}}>
            <div className="col-6">
                <p className="m-4"> 
                    what are you reading?
                </p>
            </div>
            <div className="col-6">
                <p className="m-4"> 
                    what are the readers reading?
                </p>
            </div>
        </div>
      </div>
    )
}

export default Landing;