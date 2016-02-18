from imposm.parser import OSMParser 
# Google protocol buffers -> OSM data
import json

z = []

def find_water(ways):
    # callback method for ways
    for osmid, tags, refs in ways:
        if 'man_made' in tags and ('water_well' == tags['man_made'] or 'water_tap' == tags['man_made']):
        	assert(len(refs) == 2)
        	z.append((refs, tags['man_made']))
        	print(tags['man_made'], refs);

# init parser
p = OSMParser(concurrency=4, nodes_callback=find_water)
p.parse('africa-latest.osm.pbf')

z.sort()

f = open("water_sources.txt", "w");
f.write("{data: [")
for refs, tag in z:
	f.write("{coords: ["+str(refs[0])+","+str(refs[1])+"], tag:"+tag+"},\n");


f.write("]}");
f.close();
# done
print "done"