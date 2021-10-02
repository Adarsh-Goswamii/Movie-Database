import React, { useEffect, useState } from 'react';
import Trailer_card from './Trailer_card';
import Toggle from './Toggle';
import Slider from './Slider';
import './Components_css/Trailer.css';

const Trailer = (props) => {
    let i = 0;
    let temp_popular = {};
    const [checked, setChecked] = useState('unchecked');
    const [theatre, setTheatre] = useState({ loading: true, data: [] });
    // const [popular, setPopular] = useState({});

    useEffect(() => {
        function get_theatre_movies() {
            fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${props.api_key}&page=1`)
                .then(data => data.json())
                .then(({ results }) => {
                    results.map(async (movie) => {
                        // console.log("map iteration started");
                        let video_path = await getVideos(movie.id);
                        // console.log("Got the result from getVideos", video_path);
                        const temp = {
                            id: movie.id,
                            backdrop_path: movie.backdrop_path,
                            video_path: video_path
                        };

                        // console.log("temp", temp);
                        setTheatre(({ data }) => {
                            // console.log("data", data);
                            return { loading: false, data: [...data, temp] }
                        });
                    });
                });
        }

        get_theatre_movies();
    }, []);

    // * Now when we have the movies id we can search for videos that where released on youtube.
    async function getVideos(id) {
        // console.log("get videos invoked");
        let response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${props.api_key}`)
            .then((data) => data.json())
            .then(({ results }) => {
                for (let data of results) {
                    // console.log(data);
                    if (data.site == 'YouTube' && data.type == 'Trailer') {
                        // console.log("value returned");
                        return data.key;
                    }
                }
            });

        return response;
    };

    // ============================================================================================================

    let poster = theatre.data.length > 0 ?
        `${props.image_url}${theatre.data[0].backdrop_path}` :
        "https://c4.wallpaperflare.com/wallpaper/308/457/73/penguins-of-madagascar-funny-movie-wallpaper-preview.jpg";

    poster = `url("${poster}")`;
    console.log(poster);
    const someStyle = {
        "--img-url": poster
    }

    return (
        <section
            style={ someStyle }
            className="trailer">
            <div className="trailer__head">
                <h3 className="trailer__heading">Latest Trailers</h3>
                <Toggle
                    className="trailer__toggle"
                    options={["In Threatres", "Television"]} />
            </div>
            <Slider>
                {
                    theatre.loading == true ? <p> LOADING </p> :
                        theatre.data.map(({ id: key, backdrop_path, video_path }) => {
                            return (
                                <div
                                    key={key}
                                    className="slider__container__card">
                                    <Trailer_card
                                        id={key}
                                        link={video_path}
                                        play_video={props.play_video}
                                        image_url={`${props.image_url}${backdrop_path}`}
                                    />
                                </div>
                            );
                        })
                }
            </Slider>
        </section>
    );
}

export default Trailer;