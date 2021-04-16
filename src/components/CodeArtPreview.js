import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from "gatsby-plugin-image";
import Header from './Header'

const CodeArtPreview = ({ slug, title, image, type, description, className }) => {
    if(type == 'right'){
        return (
            <div className={"flex flex-wrap md:flex-nowrap w-full justify-center md:justify-end items-center " +  className}>
                <div className="hidden md:flex flex-wrap max-w-lg w-3/4 md:w-1/2 xl:w-1/3 justify-end text-right mr-8 ml-4">
                    <Link to={slug}>
                        <Header variant="4">{title}</Header>
                    </Link>
                    <div className="flex w-full boxshadow-3d-right mt-4 mb-4">
                        {description}
                    </div>
                </div>
                <div className="flex w-3/4 md:w-1/2 xl:w-1/3 justify-center md:justify-start mx-4">
                    <Link to={slug} className="w-full max-w-md">
                        <GatsbyImage
                            image={image}
                            className="picture-border-sm-1"
                            alt={title + " Preview Image"}
                            loading="lazy" />
                    </Link>
                </div>
            </div>
        );
    }else if(type == 'left'){
        return (
            <div className={"flex flex-wrap md:flex-nowrap w-full justify-center md:justify-start items-center " + className}>
                <div className="flex w-3/4 md:w-1/2 xl:w-1/3 justify-center md:justify-end mx-4">
                    <Link to={slug} className="w-full max-w-md">
                        <GatsbyImage
                            image={image}
                            className="picture-border-sm-2 w-full"
                            alt={title + " Preview Image"}
                            loading="lazy" />
                    </Link>
                </div>
                <div className="hidden md:flex flex-wrap max-w-lg w-3/4 md:w-1/2 xl:w-1/3 justify-start text-left ml-8 mr-4">
                    <Link to={slug}>
                        <Header variant="1">{title}</Header>
                    </Link>
                    <div className="flex w-full boxshadow-3d-left mt-4 mb-4">
                        {description}
                    </div>
                </div>
            </div>
        );
    }
}

export default CodeArtPreview
