# 3D-Rectangula-Pallet-Packing
3D Bin packing system with priority concerns

this script packs 3-D objects on the basis of priority assigned to each element 

currently it follows layer in layer and shelf based approach to assign places to the objects.

Whole program follow layer in layer approach.<br />
ie, no new layer is started until one layer is complete witin a pallet.
once the above layer has started filling, items could not be added to lower layers.

We would be considering higher number as lower priority.<br />
so item with priority 10 cannot be placed on priority 8.<br />
item with priority 2 can be placed on item with priority 3 to 10.<br />
To run this approach
````
npm install
node main.js > output1.txt
````
<b> Consider version2.0 and 2.1 for better efficiency</b>

# version 2.0 uses guillotine algorithm(Guillotine split placement) to place packets in one layer

In 2D guillotine algorithm places a 2D box in lower left corner of the triangle and divide the remaining 
 L Shaped area into two seperate rectangles.This Is used for placement of boxes in each layer.
 using this algorithm we we able to improve efficiency of packing quite a bit.<br />
 <br />
# To run this program
1. Open Terminal/Cmd on the directory of the project
2. To install the dependecies of the program,Run<
````
npm install
````
3. Now we need to run version2.0 file in order to generate correct output.
````
node version2.0 > output.txt
````
then output file would be generated.<br />

different pallet no are dispayed to denote starting of a new pallet.<br />

# output.txt file would be created where each object details could be seen
a. SKU(ID) <br />
b. placement  starting position<br />
c. orientation in which it is placed.<br />
  
It is to be noted that the products printed first correspond to the first(lowest) layer in the pallet
The place where x and z are reseted to 0 is starting of the other layer.


# version 2.1 takes guillotine algorithm one step further.

In version 2.1 all the pallets are considered for placement for each box simultaniously.
ie, the pallet strting from smallest remaining volume are examined first. 
The program tries to add a temporary new layer in each pallet if box dosen"t fit in current layer.
The pallet with the smallest volume remaining which could accomodate the box is then chosen.
This helps to minimize wastage of space and simultaniously alwayes placing lower priority box over the higher one.
A new pallet is added only if none of current pallets could accomodate the box.<br /><br />


to run version 2.1, run command<br />
```` 
 node version2.1 > output.txt
 ````
ShortComings: The packing of each layer is optimized using guillotine algorithm but packing on Y axis is not.
              we still clip each layer on the basis of highest box placed in that layer.


# Future Work
consider implementing guillotine algorithm in 3-D<br /><br />

currently in 2D guillotine algorithm places a 2D box in lower left corner of the triangle and divide the remaining 
 L Shaped area into two seperate rectangles.

In 3D we could place a box in lower left corner of the pallet and then divide the pallet into 3 different parts.<br />
a. remaining part on top of where box is placed.<br />
b. 2 different parts from distributing the L shaped part remaining.<br /><br />

and then consider 3 different pallets as such. This might further increase our packing efficiency as we are currently
clipping each layer on basis of hightest box placed in that layer.

