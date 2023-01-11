bdir=$1

for mod in "$bdir"/applications/*.so
do
    node add_module --module=$mod --tdir=$bdir/tools
done