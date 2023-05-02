# Circular slider

A reusable slider component as per the instructions. I did my best to create a regulation slider in the limited time. I believe I kept the essence of the component and task, but there are a few deviations from the instructions, mostly due to lack of time and the lack of important skill demonstration value of the details. The missing details are mentioned below along with some of the ways I would design them if I judged them important enough for this showcase. If you feel there are any missing features that I should add to show some aspect of competence please don't hesitate to ask, and I'll be happy to get you sorted :)

This is not a production ready component, but it should be a good enough showcase of my thinking and process.

## What is missing

1. The design isn't pixel perfect:

> Some of the styles aren't exactly correct, due to the time consuming nature of the task, I tried to get 80% of what I judged to be most important done, but there are improvements that could be made to make the component more like the example. The font is the default sans-serif instead of the font used. The spacings of the legend aren't exactly the same, but what I judged looked good. The left-side legend is aligned in the center of the container instead of being aligned with the slider circle (I thought it looked better). The inset shadows on the slider nipple rotate as the slider value changes, which looks more natural and less jaring than the original to me. The slider background (dashed line) doesn't have the exact same amount of dashes as the original. I could have done that with a bunch of hand tweaking of the dash width calculation algorithm, but judged it not to be a top priority. The nipple position is not the same as the example for the same values. I'm guessing that that is due to a different max setting used in the original, but it looks correct to me with the options I defined. The gradient colors in the legend squares aren't exactly the same, I could have added options for to-from colors for the gradient, but automatic calculation from the slider color seemed friendlier to me, I would also replace the lighten/darken algoritm for production but I wanted to use something super simple that I would have come up with on short notice, instead of using a good one from stackoverflow, because I thought that broke the no library rule.

2. The component doesn't emit all events the html range input does and is not a range input

> For a final product I would add more events that the range input does. I would add that along with aria labels, keyboard controls and other accessibility features to make it an accessible input.

3. I didn't go with the size interpretation I mentioned in the feedback question

> I asked in a feedback question if I should make the scale option define the outermost slider radius and make the others fit inside. I didn't go with that due to time constraints and the relatively simple nature of the change I didn't think would illustrate much additional competence. If I were to implement the feature it would be a container size option, where the sizes of the inner sliders would be calculated by subtrating a fixed amount for every next inset slider and probably throwing an error if the radius value gets too small at any point. I could by following a simmilar principle make the other options shared between the sliders (shared step, min, max, prefix, automatically selected color). The default value would be overwriten if the consumer of the API defined a specific value for any of the sliders.

4. Not responsive

> According to the instructions the code should be optimized for mobile performance. In my estimate this doesn't necessarily include responsive design. I optimized the slider to work with touch, but could also add responsive optimizations. Due to the sizing of the slider this would require JS, but I could have used em/rem units, and/or recalculated the sizes on resize, and converted rems/ems to pixels for SVG support using a hidden div as a scale helper.

5. A class, but maybe not the right kind of class

> I created a reusable class for the slider, but wasn't 100% sure what kind of class was wanted. I could have just created a class that creates the elements and binds them to the DOM (which my solution effectively does), but I decided to also make it into a web component class so that the component can be registered as a web component. This has it's pros and cons, especially with the introduction of the shadow dom. I wanted to play with web components since I've never made one before, but it would be real easy to just make it into a plain class that generates the elements and appends them to the DOM.

6. "When creating a slider pass in the options object"
> I did technically do this one in the end, but the container still uses the options setter after being instantiated because of how web components work. I could have also made the component and appended it to the DOM after configuring it but I thought my current solution is good enough for this showcase so I left it the way it is in index.html. It would be very easy to change how this works.

7. "Options: container"
> I wasn't exactly sure what was meant here, but I didn't consider it important enough for this showcase to bother the nice HR person for it, so I decided to just make a reusable container component and configure it that way, but I'm sure it wouldn't be too hard to make it work the way it was intended given a little more context.
