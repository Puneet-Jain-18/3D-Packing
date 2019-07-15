# 3D-Packing
3D BIn packing system with prriority concerns

this script packs 3-D objects on the basis of priority assigned to each element 

currently it follows layer in layer and shelf based approach to assign places to the objects.

# to run this program
1. install node js on your system from site : https://nodejs.org/en/
2. go to terminal clone this repository.  
3. npm install
4. node main > output.txt

#output.txt file would be created where each object details could be seen
  a.SKU 
  b.placement  starting position
  c.orientation in which it is placed.
  
It is to be noted that the products printed first correspond to the first(lowest) layer in the pallet
The place where x and z are reseted to 0 is starting of the other layer.

#version 2.0 uses guillotine algorithm to place packets in one layer

to run version 2.0run command
  node version2.0>output.txt.

I am more confident that the output here is correct. implementable.

different pallet no are dispayed to denote starting of a new pallet.

