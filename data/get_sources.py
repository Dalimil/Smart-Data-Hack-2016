from imposm.parser.simple import OSMParser 
# Google protocol buffers -> OSM data
import json

z = []

def find_water(ways):
    # callback method for ways
    for v in ways:
    	tags = v[1]; refs = v[2]; timestamp = v[4];
        if 'man_made' in tags and ('water_well' == tags['man_made'] or 'water_tap' == tags['man_made']):
        	assert(len(refs) == 2)
        	z.append((refs, timestamp, tags['man_made']))
        	print(tags['man_made'], refs, timestamp);

# init parser
p = OSMParser(concurrency=4, nodes_callback=find_water)
p.parse('africa-latest.osm.pbf')

z.sort()

f = open("water_sources.txt", "w");
f.write("{\"data\": [")
for refs, timestamp, tag in z:
	f.write("{\"coords\": ["+str(refs[0])+","+str(refs[1])+"], \"timestamp\":"+str(timestamp)+", \"tag\":\""+tag+"\"},\n");

f.write("]}");
f.close();
# done
print "done"