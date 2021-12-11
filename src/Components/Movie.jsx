import React, { useEffect, useState } from "react";
import Movie_card from "./Movie_card";
import Toggle from "./Toggle";
import Slider from './Slider';
import '../CSS/Movie.css';
import { Link } from "react-router-dom";
import toggle_action from '../store/ToggleSlice';
import { useSelector, useDispatch } from 'react-redux';

const Movie = (props) => {
    const [movie, setMovie] = useState({ loading: true, data: [] });
    const [television, setTelevision] = useState({ loading: true, data: [] });

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${props.api_key}&page=1`)
            .then(data => data.json())
            .then(({ results }) => {
                results.map(({ id, poster_path, title, release_date, overview }) => {
                    let temp = { id, poster_path, title, release_date, overview };
                    setMovie(({ data }) => ({ loading: false, data: [...data, temp] }));
                });
            });

        fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${props.api_key}&page=1`)
            .then(data => data.json())
            .then(({ results }) => {
                results.map(({ id, poster_path, name, first_air_date, overview }) => {
                    let temp = { id, poster_path, name, first_air_date, overview };
                    setTelevision(({ data }) => ({ loading: false, data: [...data, temp] }));
                });
            });
    }, []);

    const dispatch= useDispatch();
    const { popular } = useSelector(state=> state.Toggle );

    return (
        <section
            className="movie">
            <div className="movie__head">
                <h3 className="movie__heading">What's Popular</h3>
                <Toggle
                    id="movie"
                    click={()=> dispatch(toggle_action.popularToggle()) }
                    className="movie__toggle"
                    options={[ "InTheatres", "OnTV"]} />
            </div>
            <Slider key="movie" for="-movie">
                {
                    popular=== "InTheatre" ?
                        movie.loading === true ? <p> LOADING </p> :
                            movie.data.map(({ title, id: key, poster_path: backdrop_path, overview, release_date }) => {
                                return (
                                    <div
                                        key={key}
                                        className="slider__container__card">
                                        <Link to={`/movie/${key}`}>
                                            <Movie_card
                                                id={key}
                                                movie_name={title}
                                                overview={overview}
                                                release_date={release_date}
                                                image_url={`${props.image_url}${backdrop_path}`}
                                            />
                                        </Link>
                                    </div>
                                );
                            })
                        :
                        television.loading === true ? <p> LOADING </p> :
                            television.data.map(({ name, id: key, poster_path: backdrop_path, overview, first_air_date }) => {
                                return (
                                    <div
                                        key={key}
                                        className="slider__container__card">
                                        <Link to={`/show/${key}`}>
                                            <Movie_card
                                                id={key}
                                                movie_name={name}
                                                overview={overview}
                                                release_date={first_air_date}
                                                image_url={`${props.image_url}${backdrop_path}`}
                                            />
                                        </Link>
                                    </div>
                                );
                            })
                }
            </Slider>
        </section>
    );
}

export default Movie;