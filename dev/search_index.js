var documenterSearchIndex = {"docs":
[{"location":"reference/#Reference","page":"Reference","title":"Reference","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"OffsetArray\nOffsetVector\nOffsetMatrix\nOffsetArrays.Origin\nOffsetArrays.IdOffsetRange\nOffsetArrays.no_offset_view","category":"page"},{"location":"reference/#OffsetArrays.OffsetArray","page":"Reference","title":"OffsetArrays.OffsetArray","text":"OffsetArray(A, indices...)\n\nReturn an AbstractArray that shares element type and size with the first argument, but used the given indices, which are checked for compatible size.\n\nExample: offsets\n\nThere are two types of indices: integers and ranges-like types.\n\nIntegers are recognized as offsets, where 0 means no offsets are applied:\n\njulia> A = OffsetArray(reshape(1:6, 2, 3), -1, -2)\n2×3 OffsetArray(reshape(::UnitRange{Int64}, 2, 3), 0:1, -1:1) with eltype Int64 with indices 0:1×-1:1:\n 1  3  5\n 2  4  6\n\njulia> A[0, 1]\n5\n\nExamples of range-like types are: Colon()(aka :), UnitRange(e.g, -1:2), and CartesianIndices.\n\njulia> OffsetArray(reshape(1:6, 2, 3), 0:1, -1:1)\n2×3 OffsetArray(reshape(::UnitRange{Int64}, 2, 3), 0:1, -1:1) with eltype Int64 with indices 0:1×-1:1:\n 1  3  5\n 2  4  6\n\njulia> OffsetArray(reshape(1:6, 2, 3), :, -1:1) # : as a placeholder means no offset is applied at this dimension\n2×3 OffsetArray(reshape(::UnitRange{Int64}, 2, 3), 1:2, -1:1) with eltype Int64 with indices 1:2×-1:1:\n 1  3  5\n 2  4  6\n\njulia> OffsetArray(reshape(1:6, 2, 3), CartesianIndex(0, -1):CartesianIndex(1, 1))\n2×3 OffsetArray(reshape(::UnitRange{Int64}, 2, 3), 0:1, -1:1) with eltype Int64 with indices 0:1×-1:1:\n 1  3  5\n 2  4  6\n\nIntegers and range-like types can't be used interchangebly:\n\njulia> OffsetArray(reshape(1:6, 2, 3), 0, -1:1)\nERROR: [...]\n\nExample: origin\n\nOffsetArrays.Origin can be used to directly specify the origin of the output OffsetArray.\n\njulia> a = [1 2; 3 4];\n\njulia> OffsetArray(a, OffsetArrays.Origin(0, 1))\n2×2 OffsetArray(::Array{Int64,2}, 0:1, 1:2) with eltype Int64 with indices 0:1×1:2:\n 1  2\n 3  4\n\njulia> OffsetArray(a, OffsetArrays.Origin(0)) # short notation for `Origin(0, ..., 0)`\n2×2 OffsetArray(::Array{Int64,2}, 0:1, 0:1) with eltype Int64 with indices 0:1×0:1:\n 1  2\n 3  4\n\n\n\n\n\n","category":"type"},{"location":"reference/#OffsetArrays.OffsetVector","page":"Reference","title":"OffsetArrays.OffsetVector","text":"OffsetVector(v, index)\n\nType alias and convenience constructor for one-dimensional OffsetArrays.\n\n\n\n\n\n","category":"type"},{"location":"reference/#OffsetArrays.OffsetMatrix","page":"Reference","title":"OffsetArrays.OffsetMatrix","text":"OffsetMatrix(A, index1, index2)\n\nType alias and convenience constructor for two-dimensional OffsetArrays.\n\n\n\n\n\n","category":"type"},{"location":"reference/#OffsetArrays.Origin","page":"Reference","title":"OffsetArrays.Origin","text":"Origin(indices...)\nOrigin(origin::Tuple)\nOrigin(origin::CartesianIndex)\n\nA helper type to construct OffsetArray with given origin.\n\nThe origin of an array is defined as the index of its first element, i.e., first.(axes(A)).\n\nExample\n\njulia> a = [1 2; 3 4];\n\njulia> OffsetArray(a, OffsetArrays.Origin(0, 1))\n2×2 OffsetArray(::Array{Int64,2}, 0:1, 1:2) with eltype Int64 with indices 0:1×1:2:\n 1  2\n 3  4\n\njulia> OffsetArray(a, OffsetArrays.Origin(0)) # short notation for `Origin(0, 0)`\n2×2 OffsetArray(::Array{Int64,2}, 0:1, 0:1) with eltype Int64 with indices 0:1×0:1:\n 1  2\n 3  4\n\n\n\n\n\n","category":"type"},{"location":"reference/#OffsetArrays.IdOffsetRange","page":"Reference","title":"OffsetArrays.IdOffsetRange","text":"ro = IdOffsetRange(r::AbstractUnitRange, offset=0)\n\nConstruct an \"identity offset range\". Numerically, collect(ro) == collect(r) .+ offset, with the additional property that axes(ro, 1) = axes(r, 1) .+ offset. When r starts at 1, then ro[i] == i and even ro[ro] == ro, i.e., it's the \"identity,\" which is the origin of the \"Id\" in IdOffsetRange.\n\nExamples\n\nThe most common case is shifting a range that starts at 1 (either 1:n or Base.OneTo(n)):\n\njulia> ro = OffsetArrays.IdOffsetRange(1:3, -2)\nOffsetArrays.IdOffsetRange(-1:1)\n\njulia> axes(ro, 1)\nOffsetArrays.IdOffsetRange(-1:1)\n\njulia> ro[-1]\n-1\n\njulia> ro[3]\nERROR: BoundsError: attempt to access 3-element UnitRange{Int64} at index [5]\n\nIf the range doesn't start at 1, the values may be different from the indices:\n\njulia> ro = OffsetArrays.IdOffsetRange(11:13, -2)\nOffsetArrays.IdOffsetRange(9:11)\n\njulia> axes(ro, 1)     # 11:13 is indexed by 1:3, and the offset is also applied to the axes\nOffsetArrays.IdOffsetRange(-1:1)\n\njulia> ro[-1]\n9\n\njulia> ro[3]\nERROR: BoundsError: attempt to access 3-element UnitRange{Int64} at index [5]\n\nExtended help\n\nConstruction/coercion preserves the (shifted) values of the input range, but may modify the indexes if required by the specified types. For example,\n\nr = OffsetArrays.IdOffsetRange{Int,UnitRange{Int}}(3:4)\n\nhas r[1] == 3 and r[2] == 4, whereas\n\nr = OffsetArrays.IdOffsetRange{Int,Base.OneTo{Int}}(3:4)\n\nhas r[3] == 3 and r[4] == 4, and r[1] would throw a BoundsError. In this latter case, a shift in the axes was needed because Base.OneTo ranges must start with value 1.\n\nwarning: Warning\nIn the future, conversion will preserve both the values and the indices, throwing an error when this is not achievable. For instance,r = convert(OffsetArrays.IdOffsetRange{Int,UnitRange{Int}}, 3:4)has r[1] == 3 and r[2] == 4 and would satisfy r == 3:4, whereasjulia> convert(OffsetArrays.IdOffsetRange{Int,Base.OneTo{Int}}, 3:4)    # future behavior, not present behavior\nERROR: ArgumentError: first element must be 1, got 3where the error will arise because the result could not have the same axes as the input.An important corollary is that typeof(r1)(r2) and oftype(r1, r2) will behave differently: the first coerces r2 to be of the type of r1, whereas the second converts. Developers are urged to future-proof their code by choosing the behavior appropriate for each usage.\n\n\n\n\n\n","category":"type"},{"location":"reference/#OffsetArrays.no_offset_view","page":"Reference","title":"OffsetArrays.no_offset_view","text":"no_offset_view(A)\n\nReturn an AbstractArray that shares structure and has the same type and size as the argument, but has 1-based indexing. May just return the argument when applicable. Not exported.\n\nThe default implementation uses OffsetArrays, but other types should use something more specific to remove a level of indirection when applicable.\n\njulia> A = [1 3 5; 2 4 6];\n\njulia> O = OffsetArray(A, 0:1, -1:1)\n2×3 OffsetArray(::Matrix{Int64}, 0:1, -1:1) with eltype Int64 with indices 0:1×-1:1:\n 1  3  5\n 2  4  6\n\njulia> OffsetArrays.no_offset_view(O)[1,1] = -9\n-9\n\njulia> A\n2×3 Matrix{Int64}:\n -9  3  5\n  2  4  6\n\n\n\n\n\n","category":"function"},{"location":"#OffsetArrays.jl","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"","category":"section"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"OffsetArrays provides Julia users with arrays that have arbitrary indices, similar to those found in some other programming languages like Fortran. Below is the basic usage found in the README, followed by a couple of short examples illustrating circumstances in which OffsetArrays can be useful. For a lengthier discussion, see this blog post.","category":"page"},{"location":"#Usage","page":"OffsetArrays.jl","title":"Usage","text":"","category":"section"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"You can construct such arrays as follows:","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"OA = OffsetArray(A, axis1, axis2, ...)","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"where you want OA to have axes (axis1, axis2, ...) and be indexed by values that fall within these axis ranges.","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"using OffsetArrays\n\nA = Float64.(reshape(1:15, 3, 5))\n\nOA = OffsetArray(A, -1:1, 0:4) # OA will have axes (-1:1, 0:4)\n\nOA = OffsetArray(A, CartesianIndex(-1, 0):CartesianIndex(1, 4))\n\nOA[-1,0], OA[1,4]","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"You could also pass integers as offsets, where 0 means no offsets are applied:","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"OA = OffsetArray(A, -2, -1)","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"When you create a new OffsetArray on the top of another OffsetArray, the offsets are accumulated:","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"OOA = OffsetArray(OA, 2, 1)","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"For the special cases that you want to compensate the offset back to the ordinary 1-based array, you can use OffsetArrays.no_offset_view(A). Furthermore, you could use Base.require_one_based_indexing if you want to ensure the array does not have offsets.","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"OffsetArrays.no_offset_view(OA)\n\nBase.require_one_based_indexing(ans)\n\nBase.require_one_based_indexing(OA)","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"OffsetArrays.Origin can be convenient if you want to directly specify the origin of the output OffsetArray, it will automatically compute the needed offsets. For example:","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"OffsetArray(A, OffsetArrays.Origin(-1, -1))\nOffsetArray(OA, OffsetArrays.Origin(-1, -1))","category":"page"},{"location":"#Example:-Relativistic-Notation","page":"OffsetArrays.jl","title":"Example: Relativistic Notation","text":"","category":"section"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"Suppose we have a position vector r = [:x, :y, :z] which is naturally one-based, ie. r[1] == :x, r[2] == :y,  r[3] == :z and we also want to construct a relativistic position vector which includes time as the 0th component. This can be done with OffsetArrays like","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"julia> r = [:x, :y, :z];\n\njulia> x = OffsetVector([:t, r...], 0:3)\n4-element OffsetArray(::Vector{Symbol}, 0:3) with eltype Symbol with indices 0:3:\n :t\n :x\n :y\n :z\n\njulia> x[0]\n:t\n\njulia> x[1:3]\n3-element Vector{Symbol}:\n :x\n :y\n :z","category":"page"},{"location":"#Example:-Polynomials","page":"OffsetArrays.jl","title":"Example: Polynomials","text":"","category":"section"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"Suppose one wants to represent the Laurent polynomial","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"6x + 5 - 2*x + 3*x^2 + x^3","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"The coefficients of this polynomial are a naturally -1 based list, since the nth element of the list (counting from -1) 6, 5, -2, 3, 1 is the coefficient corresponding to the nth power of x. This Laurent polynomial can be evaluated at say x = 2 as follows.","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"julia> coeffs = OffsetVector([6, 5, -2, 3, 1], -1:3)\n5-element OffsetArray(::Vector{Int64}, -1:3) with eltype Int64 with indices -1:3:\n  6\n  5\n -2\n  3\n  1\n\njulia> polynomial(x, coeffs) = sum(coeffs[n]*x^n for n in eachindex(coeffs))\npolynomial (generic function with 1 method)\n\njulia> polynomial(2.0, coeffs)\n24.0","category":"page"},{"location":"","page":"OffsetArrays.jl","title":"OffsetArrays.jl","text":"Notice our use of the eachindex function which does not assume that the given array starts at 1.","category":"page"},{"location":"internals/#For-developers","page":"For developers","title":"For developers","text":"","category":"section"},{"location":"internals/","page":"For developers","title":"For developers","text":"Writing code that supports OffsetArrays is generally fairly straightforward. The majority of cases can be handled with these tips:","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"replace many uses of size with axes\nreplace 1:length(A) with eachindex(A), or if you need an integer index with LinearIndices(A)\nreplace explicit allocations like Array{Int}(undef, size(B)) with similar(Array{Int}, axes(B))","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"More information can be found in Julia's developer documentation. The most subtle issues tend to arise around the axes, and further detail specific to OffsetArrays.jl follows below.","category":"page"},{"location":"internals/#Internals","page":"For developers","title":"Internals","text":"","category":"section"},{"location":"internals/","page":"For developers","title":"For developers","text":"How does OffsetArrays work? The fundamental principle is very simple: an OffsetArray is just a wrapper around a \"parent\" array, together with an index offset:","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"julia> oa = OffsetArray([1 2; 3 4], 0:1, 5:6)\n2×2 OffsetArray(::Matrix{Int64}, 0:1, 5:6) with eltype Int64 with indices 0:1×5:6:\n 1  2\n 3  4\n\njulia> parent(oa)\n2×2 Matrix{Int64}:\n 1  2\n 3  4\n\njulia> oa.offsets\n(-1, 4)","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"So parent(oa) is the original array we constructed it with, and oa.offsets is a tuple, each entry encoding the index-shift to be applied along the corresponding axis. When you index oa[i,j], it \"translates\" the i,j indexes back to the parent array's indexes and then returns the value in the parent.","category":"page"},{"location":"internals/#The-axes-of-OffsetArrays","page":"For developers","title":"The axes of OffsetArrays","text":"","category":"section"},{"location":"internals/","page":"For developers","title":"For developers","text":"The internal of offset computing is achieved by IdOffsetRange type:","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"julia> ax = axes(oa, 2)\nOffsetArrays.IdOffsetRange(5:6)","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"This has a similar design to Base.IdentityUnitRange that ax[x] == x always holds.","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"julia> ax[5]\n5\njulia> ax[1]\nERROR: BoundsError: attempt to access 2-element Base.OneTo{Int64} at index [-3]\n[...]","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"This property makes sure that they tend to be their own axes:","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"julia> axes(ax)\n(OffsetArrays.IdOffsetRange(5:6),)\n\njulia> axes(ax[ax])\n(OffsetArrays.IdOffsetRange(5:6),)","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"This example of indexing is idempotent. This is a useful characteristic for ensuring the \"fundamental axiom\" of generalized indexing, that a[ax][i] == a[ax[i]]:","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"julia> oa2 = OffsetArray([5, 10, 15, 20], 0:3)\n4-element OffsetArray(::Vector{Int64}, 0:3) with eltype Int64 with indices 0:3:\n  5\n 10\n 15\n 20\n\njulia> ax2 = axes(oa2, 1)\nOffsetArrays.IdOffsetRange(0:3)\n\njulia> oa2[2]\n15\n\njulia> oa2[ax2][2]\n15\n\njulia> oa2[ax2[2]]\n15","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"IdOffsetRanges apply the offset both to the values and the indices of the range, and otherwise preserve the parent range.","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"warning: Warning\nThere are circumstances where constructing a specific type of IdOffsetRange cannot be supported without changing the axes of the range (see OffsetArrays.IdOffsetRange.) In the future, this package will distinguish between construction  and conversion:construction (aka, coercion) will always succeed, even if it has to change the axes of the result (Examples: RangeType(rng), typeof(rng1)(rng2))\nconversion will succeed only if it can preserve both the values and the axes (Examples: convert(RangeType, rng), oftype(rng1, rng2))While these behave equivalently now (conversion currently performs coercion), developers are encouraged to \"future-proof\" their code by choosing the behavior appropriate for each usage.","category":"page"},{"location":"internals/#Caveats","page":"For developers","title":"Caveats","text":"","category":"section"},{"location":"internals/","page":"For developers","title":"For developers","text":"Because IdOffsetRange behaves quite differently to the normal UnitRange type, there are some cases that you should be aware of, especially when you are working with multi-dimensional arrays.","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"One such cases is getindex:","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"julia> Ao = zeros(-3:3, -3:3); Ao[:] .= 1:49;\n\njulia> Ao[-3:0, :] |> axes # the first dimension does not preserve offsets\n(OffsetArrays.IdOffsetRange(1:4), OffsetArrays.IdOffsetRange(-3:3))\n\njulia> Ao[-3:0, -3:3] |> axes # neither dimensions preserve offsets\n(Base.OneTo(4), Base.OneTo(7))\n\njulia> Ao[axes(Ao)...] |> axes # offsets are preserved\n(OffsetArrays.IdOffsetRange(-3:3), OffsetArrays.IdOffsetRange(-3:3))\n\njulia> Ao[:] |> axes # This is linear indexing\n(Base.OneTo(49),)","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"Note that if you pass a UnitRange, the offsets in corresponding dimension will not be preserved. This might look weird at first, but since it follows the a[ax][i] == a[ax[i]] rule, it is not a bug.","category":"page"},{"location":"internals/","page":"For developers","title":"For developers","text":"julia> I = -3:0; # UnitRange always starts at index 1\n\njulia> Ao[I, 0][1] == Ao[I[1], 0]\ntrue\n\njulia> ax = axes(Ao, 1) # ax starts at index -3\nOffsetArrays.IdOffsetRange(-3:3)\n\njulia> Ao[ax, 0][1] == Ao[ax[1], 0]\ntrue","category":"page"}]
}