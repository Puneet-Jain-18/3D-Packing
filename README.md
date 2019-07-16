# 3D-Packing
3D BIn packing system with prriority concerns

this script packs 3-D objects on the basis of priority assigned to each element 

currently it follows layer in layer and shelf based approach to assign places to the objects.

# to run this program
1. install node js on your system from site : https://nodejs.org/en/
2. go to terminal clone this repository.  
3. npm install
4. node main > output.txt

# output.txt file would be created where each object details could be seen
  a.SKU 
  b.placement  starting position
  c.orientation in which it is placed.
  
It is to be noted that the products printed first correspond to the first(lowest) layer in the pallet
The place where x and z are reseted to 0 is starting of the other layer.

# version 2.0 uses guillotine algorithm(Guillotine split placement) to place packets in one layer

to run version 2.0run command
  node version2.0 > output.txt.

then output file would be generated.
I am more confident that the output here is correct and implementable.

different pallet no are dispayed to denote starting of a new pallet.

# version 2.1 takes guillotine algorithm one step further.

In version 2.1 all the pallets are considered for placement for each box simultaniously.
ie, the pallet strting from smallest remaining volume are examined first. 
The program tries to add a temporary new layer in each pallet if box dosen"t fit in current layer.
The pallet with the smallest volume remaining which could accomodate the box is then chosen.
This helps to minimize wastage of space and simultaniously alwayes placing lower priority box over the higher one.
A new pallet is added only if none of current pallets could accomodate the box.


to run version 2.1, run command
  node version2.1 > output.txt.

ShortComings: The packing of each layer is optimized using guillotine algorithm but packing on Y axis is not.
              we still clip each layer on the basis of highest box placed in that layer.


# Future Work
consider implementing guillotine algorithm in 3-D

currently in 2D guillotine algorithm places a 2D box in lower left corner of the triangle and divide the remaining 
 L Shaped area into two seperate rectangles.

In 3D we could place a box in lower left corner of the pallet and then divide the pallet into 3 different parts.
a. remaining part on top of where box is placed.
b. 2 different parts from distributing the L shaped part remaining.

and then consider 3 different pallets as such. This might further increase our packing efficiency as we are currently
clipping each layer on basis of hightest box placed in that layer.

