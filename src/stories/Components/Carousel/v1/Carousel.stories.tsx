import React from 'react'
import { Story } from '@storybook/react'
import Carousel, {
  CarouselProps, Next, PlayPause, Previous, Slide, SlideNav, Slides,
} from '../../../../lib/components/Carousel/v1/Carousel'
import documentation from './Carousel.doc'

export default {
  title: 'Components/Carousel/v1 - By Camille',
  component: Carousel,
  argTypes: {
    isPlaying: {
      control: false,
    },
  },
  parameters: {
    componentSource: {
      url: [
        'https://gitlab.com/api/v4/projects/24477877/repository/files/src%2Flib%2Fcomponents%2FCarousel%2Fv1%2FCarousel%2Etsx/raw?ref=master',
        'https://gitlab.com/api/v4/projects/24477877/repository/files/src%2Flib%2Fcomponents%2FCarousel%2Fv1%2Fstyle%2Ecss/raw?ref=master',
      ],
      language: 'javascript',
    },
    docs: {
      description: {
        component: documentation,
      },
    },
  },
}

const Template: Story<CarouselProps> = (args) => <Carousel {...args} />

export const Default = Template.bind({})
Default.args = {
  children: [
    <Slides>
      <Slide><img className="slide" src="https://picsum.photos/id/1002/300" alt="random" /></Slide>
      <Slide><img className="slide" src="https://picsum.photos/id/1015/300" alt="random" /></Slide>
      <Slide><img className="slide" src="https://picsum.photos/id/1019/300" alt="random" /></Slide>
      <Slide><img className="slide" src="https://picsum.photos/id/1022/300" alt="random" /></Slide>
      <Slide><img className="slide" src="https://picsum.photos/id/1041/300" alt="random" /></Slide>
    </Slides>,
    <SlideNav className="SlideNav" />,
    <div className="SlideControls">
      <Previous><img className="btnControls" src="https://img.icons8.com/nolan/64/rewind.png" alt="bouton précédent" /></Previous>
      <PlayPause>
        <img className="btnControls" src="https://img.icons8.com/nolan/64/play.png" alt="bouton play" />
        <img className="btnControls" src="https://img.icons8.com/nolan/64/pause.png" alt="bouton pause" />
      </PlayPause>
      <Next><img className="btnControls" src="https://img.icons8.com/nolan/64/fast-forward.png" alt="bouton suivant" /></Next>
    </div>,
  ],
}
